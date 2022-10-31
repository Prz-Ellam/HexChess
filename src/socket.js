const { nanoid } = require('nanoid');

module.exports = function (io) {

    var clients = {};
    var games = {};

    let gamesReady = {};

    io.on('connection', socket => {

        console.log(`New user with id: ${socket.id} joined the server`);
        clients[socket.id] = {};

        socket.on('disconnect', () => {

            console.log(`The user with id: ${socket.id} disconnected from server`);
            
            for (const [ id, value ] of Object.entries(games)) {
                if (value.playerA === socket.id || value.playerB === socket.id) {
                    delete games[id];
                    io.to(id).emit('terminateGame');
                    io.in(id).socketsLeave(id);
                }
            }
            
            delete clients[socket.id];
            console.log(clients);

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

        // socket.join
        // socket.to

    });

}