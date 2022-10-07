const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

const socket = require('./socket');
socket(io);

//database = require('./database');
//database();

app.set('views', path.join(__dirname, '/views'));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
    res.render('play.html');
});

app.get('/game', (req, res) => {
    res.render('index.html');
});

app.get('/scenario', (req, res) => {
    res.render('escenarios.html');
});

app.get('/mode', (req, res) => {
    res.render('modojuego.html');
})

app.get('/configuration', (req, res) => {
    res.render('configuracion.html');
});

app.get('/players', (req, res) => {
    res.render('jugadores.html');
});

app.get('/dificulty', (req, res) => {
    res.render('dificultad.html');
})

app.get('/score', (req, res) => {
    res.render('score.html');
});

app.get('/pause', (req, res) => {
    res.render('pausa.html');
})

// Static files (HTML, CSS, Front JS)
app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});