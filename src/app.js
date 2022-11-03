



require('./config/env');

const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);


const io = socketio(server);

const socket = require('./config/socket');
socket(io);

database = require('./config/database');
database();

const session = require('express-session');
const passport = require('passport');
const { hashPwd } = require('./utils/crypto');
const FacebookStrategy = require('passport-facebook').Strategy;


const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.SECRET_JWT
}

passport.use(new JwtStrategy(opts, (decoded, done) => {
    return done(null, false);
}))

// Middlewares
// morgan
// app.use(morgan('dev'))
app.use(express.json());
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());

// Routes

// Static
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

app.post('/api/v1/users', (req, res) => {

    User = require('./models/user.model');

    hashPwd(req.body.password, (err, res) => {
        const user = new User({
            username: req.body.username,
            password: res
        });
    
        user.save();
    });

    res.json([ req.body ]);
});

app.get('/api/v1/users/:id', (req, res) => {

});

app.post('/api/v1/login', (req, res) => {

});

app.post('/api/v1/scores', (req, res) => {
    
});

app.get('*', (req, res, next) => {
    res.redirect('/');
});

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