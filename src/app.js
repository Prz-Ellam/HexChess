// Se añaden las variables de entorno
require('./config/env');

// Se importan los modulos para la creación del servidor
const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const cookieParser = require("cookie-parser");

// El servidor se crea
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

database = require('./config/database');
database();

const socket = require('./config/socket');
socket(io);

const { hashPwd } = require('./utils/crypto');

const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY
}

const jwt = require('jsonwebtoken');

passport.use(new JwtStrategy(opts, (decoded, done) => {
    console.log(decoded);
    return done(null, true);
}));


// Middlewares
const cors = require('cors');

//app.use(cors());
app.use(express.json());
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

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
    profileFields: ['id', 'displayName', 'email']
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
const bcrypt = require('bcrypt');
//app.set('views', path.join(__dirname, '../dist'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
    res.render('index.html');
});

User = require('./models/user.model');
const Ajv = require("ajv");
const { compare } = require('bcrypt');

app.post('/api/v1/users', async (req, res) => {

    if (!req.body)  
        return res.status(400).json({ 'status': false, 'message': 'Missing parameters' });
    if (!req.body.username || !req.body.password)
        return res.status(400).json({ 'status': false, 'message': 'Missing parameters' });

    const schema = {
        type: 'object',
        properties: {
            username: {
                type: 'string',
                minLength: 3,
                maxLength: 20
            },
            password: {
                type: 'string'
            }
        },
        required: [ 'username', 'password' ]
    }

    const ajv = new Ajv({ allErrors: true });
    const valid = ajv.validate(schema, req.body);

    if (!valid)
        return res.status(400).json({ 'status': valid, message: ajv.errorsText(ajv.errors, 
            { separator: '\n' }) });

    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.username.toUpperCase(),
        password: hashedPwd,
        victories: 0,
        defeats: 0
    });
    
    user.save();

    res.json({ 'status': true, 'message': 'The user was created successfully' });

});

app.post('/api/v1/login', async (req, res) => {

    if (!req.body)  
        return res.status(400).json({ 
            'status': false, 
            'message': 'Missing parameters' 
        });
    if (!req.body.username || !req.body.password)
        return res.status(400).json({ 
            'status': false, 
            'message': 'Missing parameters' 
        });

    const user = await User.findOne({ username: req.body.username });
    if (!user)
        return res.status(401).json({ 
            'status': false, 
            'message': 'Invalid credentials' 
        });

    if (!await compare(req.body.password, user.password))
        return res.status(401).json({ 
            'status': false, 
            'message': 'Invalid credentials' 
        });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET_KEY);
    req.headers.authorization = token;
    res
        .cookie('Authorization', token)
        .header('Authorization', token)
        .json({ 
            'status': true, 
            'token': token 
        }
    );

});

app.post('/api/v1/scores', passport.authenticate('jwt', { session: false }), async (req, res) => {
    
    const user = await User.findOneAndUpdate({ username: 'ELIAM' }, 
    { $inc: { victories: 1 } }, 
    { new: true });

    res.json({ 'A': user});

});

app.get('/api/v1/scores', async (req, res) => {

    const scores = await User.find({}, { username: 1, victories: 1 }).sort({ 'victories': -1 });
    res.json(scores);

});

app.post('/api/v1/logout', async (req, res) => {

    res.clearCookie('Authorization');
    res.json({ 'status': true, 'message': 'Logout' });

})

app.post('/api/v1/games', async (req, res) => {

    const token = req.cookies.Authorization;
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findOneAndUpdate({ _id: decode.id },
            { $inc: { victories: 1 } }, 
            { new: true });

        res.json(user);
    }
    catch (e) {
        res.json({ status: 'No session' });
    }

});

Game = require('./models/game.model');

app.get('/api/v1/test', async (req, res) => {
    // Si no encuentre uno devuelve null
    const game = await Game.findOne({ $and: [ { greenPlayer: null }, { configuration: {
        mode: 'CHECKMATE',
        dificulty: 'NORMAL',
        scenario: 'FOREST'
    } } ] });
            
            
    console.log(game);
    res.json(game);
})

app.get('*', (req, res, next) => {
    res.redirect('/');
});



app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);
});