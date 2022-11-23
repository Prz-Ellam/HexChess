const { nanoid } = require('nanoid');
const Ajv = require('ajv');
const { update } = require('../models/client.model');

Clients = require('../models/client.model');
Game = require('../models/game.model');

module.exports = async function (io) {

    await Clients.deleteMany({});
    await Game.deleteMany({});

    const gamesInterval = {};

    const clientStream = Clients.watch([
        { $match: { "operationType": { $in: [ "insert", "update", "replace" ] } } },
        { $project: { "_id": 1, "fullDocument": 1, "ns": 1, "documentKey": 1 } }
    ], { fullDocument: 'updateLookup' });
    const gameStream = Game.watch([
        { $match: { "operationType": { $in: [ "insert", "update", "replace" ] } } },
        { $project: { "_id": 1, "fullDocument": 1, "ns": 1, "documentKey": 1 } }
    ], { fullDocument: 'updateLookup' });

    gameStream.on('change', async change => {
        if (change.operationType === 'update') {

            const game = change.fullDocument;
            const updated = change.updateDescription.updatedFields;

            if (game.redReady && game.greenReady && (updated.redReady || updated.greenReady)) {
                
                gamesInterval[game.code] = {};
                gamesInterval[game.code]['countdown'] = 60; 

                const timer = async () => {
                    io.to(game.code).emit('time', gamesInterval[game.code]['countdown']--);
                    if (gamesInterval[game.code]['countdown'] === 0) {
                        changeTeam();
                    }
                }

                const interval = setInterval(timer, 1000);
                gamesInterval[game.code]['interval'] = interval;
                gamesInterval[game.code]['timer'] = timer;
                const mongoGame = await Game.findOneAndUpdate({ _id: game._id }, 
                    { turn: 'RED', readReady: false, greenReady: false }, 
                    { new: true });

                const changeTeam = async () => {
                    mongoGame.turn = (mongoGame.turn === 'RED') ? 'GREEN' : 'RED';
                    await mongoGame.save();
                    gamesInterval[game.code]['countdown'] = 60;
                }
            }

            if (updated.turn) {
                io.to(game.code).emit('setTurn', updated.turn);
            }

            if ((game.turn === 'RED' && updated.redComplete) ||
                (game.turn === 'GREEN' && updated.greenComplete)) {

                clearInterval(gamesInterval[game.code]['interval']);

            }

            if (game.redComplete && game.greenComplete) {
                console.log('Este');
                const mongoGame = await Game.findOne({ code: game.code });
                mongoGame.redComplete = false;
                mongoGame.greenComplete = false;
                mongoGame.turn = (mongoGame.turn === 'RED') ? 'GREEN' : 'RED';
                await mongoGame.save();
                gamesInterval[game.code]['countdown'] = 60;
                setInterval(gamesInterval[game.code]['timer'], 1000);
            }

        } 
    });

    clientStream.on('change', async change => {

        if (change.operationType === 'delete') {

            const socketId = change.documentKey._id;
            console.log(`The games of the client ${socketId} will be deleted`);

            const games = await Game.find({ $or: [ { redPlayer: socketId }, { greenPlayer: socketId } ] });
            console.log(`Total games deleted: ${games.length}`)
            games.forEach(game => {
                if (game.redPlayer === socketId) {
                    //clearInterval(gamesInterval[game.code]['interval']);
                    delete gamesInterval[game.code];
                    console.log(game)
                    io.to(game.greenPlayer).emit('finishGame');
                }
                else {
                    //clearInterval(gamesInterval[game.code]['interval']);
                    delete gamesInterval[game.code];
                    io.to(game.redPlayer).emit('finishGame');
                }
            });

            await Game.deleteMany({ $or: [ { redPlayer: socketId }, { greenPlayer: socketId } ] }); 
        }
    });

    io.on('connection', socket => {

        console.log(`New client with id: ${socket.id} joined the server`);
        var client = new Clients({ _id: socket.id });
        client.save();

        socket.on('disconnect', async () => {

            console.log(`The client with id: ${socket.id} disconnected from server`);
            await Clients.deleteOne({ _id: socket.id });

        });

        socket.on('hostGame', async configuration => {

            const schema = {
                type: 'object',
                properties: {
                    mode: {
                        type: 'string',
                        pattern: '^(CHECKMATE|COLDWAR)$'
                    },
                    dificulty: {
                        type: 'string',
                        pattern: '^(NORMAL|HARD)$'
                    },
                    scenario: {
                        type: 'string',
                        pattern: '^(FOREST|DESERT|SNOW)$'
                    }
                },
                required: [ 'mode', 'dificulty', 'scenario' ]
            }

            const ajv = new Ajv();
            const valid = ajv.validate(schema, configuration);

            if (!valid)
                return socket.emit('hostGame', {
                    'status': false,
                    'message': 'Parameters are not correct'
                });

            const code = nanoid(12);
            const game = new Game({
                code: code,
                redPlayer: socket.id,
                greenPlyaer: null,
                configuration: configuration,
                redReady: false,
                greenReady: false
            });

            await game.save();
            socket.join(code);

            socket.emit('hostGame', code);

        });

        socket.on('joinGame', async code => {

            const game = await Game.findOne({ code: code });
            if (!game)
                return socket.emit('joinGame', {
                    status: false,
                    message: "The game doesn't exists"
                });

            if (game.redPlayer === socket.id)
                return socket.emit('joinGame', {
                    status: false,
                    message: "You are already in the game"
                });

            const newGame = await Game.findOneAndUpdate({ code: code }, 
            { greenPlayer: socket.id }, { new: true });
            socket.join(game.code);

            socket.emit('joinGame', {
                status: true,
                message: 'You joined the game successfully'
            });

            io.to(game.code).emit('startGame', newGame);

        });

        socket.on('findGame', async configuration => {

            console.log(`The client ${socket.id} request a game to join`);

            const game = await Game.findOne({ $and: [ { greenPlayer: null }, { configuration: configuration } ] });
            
            if (!game) {
                const schema = {
                    type: 'object',
                    properties: {
                        mode: {
                            type: 'string',
                            pattern: '^(CHECKMATE|COLDWAR)$'
                        },
                        dificulty: {
                            type: 'string',
                            pattern: '^(NORMAL|HARD)$'
                        },
                        scenario: {
                            type: 'string',
                            pattern: '^(FOREST|DESERT|SNOW)$'
                        }
                    },
                    required: [ 'mode', 'dificulty', 'scenario' ]
                }
    
                const ajv = new Ajv();
                const valid = ajv.validate(schema, configuration);
    
                if (!valid)
                    return socket.emit('findGame', {
                        'status': false,
                        'message': 'Parameters are not correct'
                    });
    
                const code = nanoid(12);
                const game = new Game({
                    code: code,
                    redPlayer: socket.id,
                    greenPlyaer: null,
                    configuration: configuration,
                    redReady: false,
                    greenReady: false
                });
    
                await game.save();
                socket.join(code);
    
                socket.emit('findGame', {
                    'status': true,
                    'message': code
                });
            }
            else {
                if (!game)
                    return socket.emit('findGame', {
                        status: false,
                        message: "The game doesn't exists"
                    });

                if (game.redPlayer === socket.id)
                    return socket.emit('findGame', {
                        status: false,
                        message: "You are already in the game"
                    });

                const newGame = await Game.findOneAndUpdate({ code: game.code }, 
                { greenPlayer: socket.id }, { new: true });
                socket.join(game.code);

                socket.emit('findGame', {
                    status: true,
                    message: 'You joined the game successfully'
                });

                //io.to(game.code).emit('startGame', newGame);
                io.to(newGame.redPlayer).emit('startGame', {
                    team: 'RED',
                    configuration: newGame.configuration
                });
                io.to(newGame.greenPlayer).emit('startGame', {
                    team: 'GREEN',
                    configuration: newGame.configuration
                })
            }
            
        });

        socket.on('ready', async () => {

            const gameCode = Array.from(socket.rooms)[1];

            const game = await Game.findOne({ code: gameCode });
            if (!game) {
                console.log('No pertenece a ninguna partida este individuo');
                return;
            }

            if (game.redPlayer === socket.id) {
                game.redReady = true;
                game.save();
            }
            else if (game.greenPlayer === socket.id) {
                game.greenReady = true;
                game.save();
            }
            else {
                console.log('No pertenece a la partida este individuo');
            }

        });

        socket.on('moveComplete', async () => {

            const gameCode = Array.from(socket.rooms)[1];

            const game = await Game.findOne({ code: gameCode });
            if (!game) {
                console.log('No pertenece a ninguna partida este individuo');
                return;
            }

            if (game.redPlayer === socket.id) {
                game.redComplete = true;
                game.save();
            }
            else if (game.greenPlayer === socket.id) {
                game.greenComplete = true;
                game.save();
            }
            else {
                console.log('No pertenece a la partida este individuo');
            }

        });

        socket.on('select', data => {
            // Devuelvesela a todos los clientes
            const game = Array.from(socket.rooms)[1];
            io.to(game).emit('select', data);
        });

        socket.on('deselect', data => {
            const game = Array.from(socket.rooms)[1];
            io.to(game).emit('deselect', data);
        });

        socket.on('move', data => {
            const game = Array.from(socket.rooms)[1];
            io.to(game).emit('move', data);
        });

        socket.on('setItem', data => {
            const game = Array.from(socket.rooms)[1];
            io.to(game).emit('setItem', data);
        });

        socket.on('setVariations', data => {
            const game = Array.from(socket.rooms)[1];
            io.to(game).emit('setVariations', data);
        });

        socket.on('gameOver', async () => {

            const gameCode = Array.from(socket.rooms)[1];

            const game = await Game.findOne({ code: gameCode });
            if (!game) {
                console.log('No pertenece a ninguna partida este individuo');
                return;
            }
            else {
                
                console.log(game);
            }

        })

    });

}