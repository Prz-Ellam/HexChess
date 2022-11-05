const { nanoid } = require('nanoid');

Clients = require('../models/client.model');
Game = require('../models/game.model');

const Ajv = require('ajv');

module.exports = async function (io) {

    await Clients.deleteMany({});
    await Game.deleteMany({});

    let gamesReady = {};

    io.on('connection', socket => {

        console.log(`New client with id: ${socket.id} joined the server`);
        var client = new Clients({ _id: socket.id });
        client.save();

        socket.on('disconnect', async () => {

            console.log(`The client with id: ${socket.id} disconnected from server`);
     
            await Game.deleteMany({ $or: [ { redPlayer: socket.id }, { greenPlayer: socket.id } ] });
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
                configuration: configuration
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

            const game = await Game.findOne({ $and: [ { greenPlayer: null }, { configuration: configuration } ] });
            
            if (!game)
            {
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
                    configuration: configuration
                });
    
                await game.save();
                socket.join(code);
    
                socket.emit('hostGame', code);
            }
            else
            {
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

                const newGame = await Game.findOneAndUpdate({ code: game.code }, 
                { greenPlayer: socket.id }, { new: true });
                socket.join(game.code);

                socket.emit('joinGame', {
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

        socket.on('select', data => {
            // Devuelvesela a todos los clientes
            const room = Array.from(socket.rooms)[1];
            io.to(room).emit('select', data);

        });

        socket.on('deselect', data => {
            const room = Array.from(socket.rooms)[1];
            io.to(room).emit('deselect', data);
        });

        socket.on('move', data => {
            const room = Array.from(socket.rooms)[1];
            io.to(room).emit('move', data);
        });

        socket.on('moveComplete', status => {

            console.log(clients);
            if (gamesReady[clients[socket.id].game] === 1) {
                console.log('Mas uno');
                gamesReady[clients[socket.id].game] = 0;
                console.log('Emite');
                io.emit('changeTurn', {});
            }
            else {
                console.log('Uno');
                gamesReady[clients[socket.id].game] = 1;
            }

            console.log('Complete: ' + new Date());
        });

        
        var i = 0;
        setInterval(() => socket.emit('time', i++), 1000);

    });

}