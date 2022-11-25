// Se añaden las variables de entorno
require('./config/env');

// Se importan los modulos para la creación del servidor
const http = require('http');
const express = require('express');
const path = require('path');


// El servidor se crea
const app = express();
const server = http.createServer(app);


// Database
const database = require('./config/database');
database();


// Socket
const socketio = require('socket.io');
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: [ 'GET', 'POST' ]
    }
});
const socket = require('./config/socket');
socket(io);


// Session
const session = require('express-session');
const passport = require('./config/passport');


// Middlewares
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(session({ secret: process.env.SECRET }));
app.use(passport.initialize());
app.use(passport.session());


// Static
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);


// Routes
app.get('/', (req, res) => {
    res.render('index.html');
});

const usersRoutes = require('./routes/users.routes');
app.use('/api/v1/users', usersRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/api/v1/auth', authRoutes);

const scoresRoutes = require('./routes/scores.routes');
app.use('/api/v1/scores', scoresRoutes);

const gamesRoutes = require('./routes/games.routes');
app.use('/api/v1/games', gamesRoutes);

app.get('*', (req, res, next) => {
    res.redirect('/');
});


// Server start
app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);
});