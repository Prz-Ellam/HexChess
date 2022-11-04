const { nanoid } = require('nanoid');

Clients = require('../models/client.model');
Game = require('../models/game.model');

const Ajv = require('ajv');

module.exports = async function (io) {

    console.log('Hi');
    await Clients.deleteMany({});

    var clients = {};
    var games = {};

    let gamesReady = {};

    io.on('connection', socket => {

        console.log(`New client with id: ${socket.id} joined the server`);
        var client = new Clients({ _id: socket.id });
        client.save()
        clients[socket.id] = {};

        socket.on('disconnect', async () => {

            console.log(`The client with id: ${socket.id} disconnected from server`);
            
            for (const [ id, value ] of Object.entries(games)) {
                if (value.playerA === socket.id || value.playerB === socket.id) {
                    delete games[id];
                    io.to(id).emit('terminateGame');
                    io.in(id).socketsLeave(id);
                }
            }
            
            delete clients[socket.id];
            await Clients.deleteOne({ _id: socket.id });

            // console.log(clients);

        });

        socket.on('hostGame', async config => {

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
            const valid = ajv.validate(schema, config);

            if (!valid)
                return socket.emit('hostGame', {
                    'status': false,
                    'message': 'Parameters are not correct'
                });

            console.log(config);

            const code = nanoid(12);
            const game = new Game({
                code: code,
                redPlayer: socket.id,
                greenPlyaer: null,
                configuration: config
            });

            await game.save();

            socket.emit('hostGame', code);

        });

        socket.on('joinGame', configuration => {

            for (const [id, value] of Object.entries(games)) {
                if (JSON.stringify(value.configuration) === JSON.stringify(configuration)
                    && !value.playerB) {
                    
                    games[id].playerB = socket.id;
                    socket.join(id);

                    //io.to(id).emit('found');
                    io.to(games[id].playerA).emit('found', { team: 'A' });
                    io.to(games[id].playerB).emit('found', { team: 'B' });

                    
                    return;
                }
            }

            const id = nanoid(12);
            games[id] = {};
            games[id].configuration = configuration;
            games[id].playerA = socket.id;
            games[id].playerB = null;
            socket.join(id);

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