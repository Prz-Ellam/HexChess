const { nanoid } = require('nanoid');

module.exports = function (io) {

    var clients = {};
    var games = {};

    let clientsCount = 0;
    let gamesReady = {};

    io.on('connection', socket => {

        console.log(Math.floor(clientsCount / 2.0));
        socket.join(clientsCount++);

        console.log(`New user with id: ${socket.id}`);
        clients[socket.id] = {};
        clients[socket.id].game = 1;


        socket.on('send', message => {

            // Este es para todos los clientes
            io.emit('receive', message);

            // Este es para todos excepto
            // io.broadcast.emit();

        });

        socket.on('disconnect', () => {

            console.log(`The user with id: ${socket.id} disconnected from server`);
            delete clients[socket.id];
            clientsCount--;
            //io.broadcast.emit('send', 'Se fue');
        });

        socket.on('hostGame', () => {

            const id = nanoid(12);
            games[id] = [];
            games[id].push(socket.id);

            console.log(id);
            console.log(games);

        });

        socket.on('joinGame', data => {

            let found = false;
            // Find id
            const id = data.id;
            if (id in games) {
                if (games[id].length < 2) {
                    games[id].push(socket.id);
                    found = true;
                }
            }

            console.log(games);
        });

        socket.on('select', (data) => {
            //console.log(data);
            // Devuelvesela a todos los clientes
            io.emit('select', data);

        });

        socket.on('move', data => {
            io.emit('move', data);
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