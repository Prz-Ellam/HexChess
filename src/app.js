const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const dotenv = require('dotenv');

// Settings or Config


// Middlewares
// morgan
// app.use(morgan('dev'))
// app.use(express.json())

// Routes

// Static


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const socket = require('./socket');
socket(io);

database = require('./database');
database();

const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
})

passport.use(new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: '/facebook/callback',
    profileFields: ['id', 'displayName', 'picture.type(large)', 'email']
}, function (token, refreshToken, profile, done) {
    console.log(profile);
    return done(null, profile);
}
));

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/failed'
}));



// Esta ruta debia morir para que jalara el proyecto
//app.set('views', path.join(__dirname, '../dist'));

// Static files
app.use(express.static(path.join(__dirname, '../dist')));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('*', (req, res, next) => {
    res.redirect('/');
})

/*
app.get('/profile', (req, res) => {
    res.send('You are a valid user');
})

app.get('/failed', (req, res) => {
    res.send('You are NOT a valid user');
})

app.get('/boxicons.min.css', function(req, res) {
    res.sendFile(__dirname + '/../.env');
});
*/

app.get('/api/v1/scores', async (req, res) => {

    User = require('./models/user');
    const user = new User();
/*
    const user = new User({
        id: '1',
        name: 'Eliam',
        email: 'eliam@correo.com'
    });

    user.save();
*/ 
    await User.find({ email: 'eliam@correo.com' }, (err, users) => { res.json(users) });

    //res.json({});
});


app.set('port', process.env.PORT || 3000);



server.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);
});