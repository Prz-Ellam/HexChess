const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, '/public'));
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

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})