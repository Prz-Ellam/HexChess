module.exports = function(io) {

    io.on('connection', socket => {
        
        console.log(`New user with id: ${socket.id}`);

        socket.on('send', message => {

            // Este es para todos los clientes
            io.emit('receive', message);

            // Este es para todos excepto
            // io.broadcast.emit();

        });

        socket.on('disconnect', () => {
            console.log('Se fue');
            //io.broadcast.emit('send', 'Se fue');
        })

        // socket.join
        // socket.to

    });

}