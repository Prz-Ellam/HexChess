User = require('../models/user.model');
const bcrypt = require('bcrypt');
const Ajv = require('ajv');

UserController = {

    create: async function(req, res) {

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
            required: ['username', 'password']
        }

        const ajv = new Ajv({ allErrors: true });
        const valid = ajv.validate(schema, req.body);

        if (!valid)
            return res.status(400).json({
                'status': valid, message: ajv.errorsText(ajv.errors,
                    { separator: '\n' })
            });

        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username.toUpperCase(),
            password: hashedPwd,
            victories: 0,
            defeats: 0
        });

        user.save();

        res.json({ 'status': true, 'message': 'The user was created successfully' });

    }

}

module.exports = UserController;