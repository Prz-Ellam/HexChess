User = require('../models/user.model');
const bcrypt = require('bcrypt');
const Ajv = require('ajv');
const jwt = require('jsonwebtoken');

UserController = {

    create: async function(req, res) {

        if (!req.body)
            return res.status(400).json({ 'status': false, 'message': 'Favor de ingresar sus datos' });
        if (!req.body.username || !req.body.password)
            return res.status(400).json({ 'status': false, 'message': 'Favor de ingresar sus datos' });

        const schema = {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 20
                },
                password: {
                    type: 'string',
                    minLength: 6
                }
            },
            required: [ 'username', 'password' ]
        }

        const ajv = new Ajv({ allErrors: true });
        const valid = ajv.validate(schema, req.body);

        if (!valid)
            return res.status(400).json({
                'status': valid, message: ajv.errorsText(ajv.errors,
                    { separator: '\n' })
            });

        const searchUser = await User.findOne({ username: req.body.username });
        if (searchUser)
            return res.status(401).json({ 
                'status': false, 
                'message': 'Alguien ya posee este nombre de usuario' 
            });

        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username.toUpperCase(),
            password: hashedPwd,
            victories: 0,
            defeats: 0
        });

        user.save();

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET_KEY);
        res
            .cookie('Authorization', token)
            .json({ 'status': true, 'message': 'El usuario fue creado satisfactoriamente' });

    }

}

module.exports = UserController;