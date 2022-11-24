const { compare } = require('bcrypt');
const jwt = require('jsonwebtoken');
User = require('../models/user.model');

module.exports = {

    login: async (req, res) => {

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
    
    },

    logout: async (req, res) => {

        res.clearCookie('Authorization');
        res.json({ 'status': true, 'message': 'Logout' });
    
    }

}
