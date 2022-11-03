/*
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Prueba');
});

module.exports = router;
*/

const express = require('express');
const { hashPwd } = require('../utils/crypto');
const userRouter = express.Router();

//userRouter.post('/api/v1/users', );
//userRouter.get('/api/v1/users/:id', );

userRouter.post('/api/v1/users', (req, res) => {

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

module.exports = userRouter;