const jwt = require('jsonwebtoken');
User = require('../models/user.model');

module.exports = {

    save: async (req, res) => {

        const token = req.cookies.Authorization;
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
            const user = await User.findOneAndUpdate({ _id: decode.id },
                { $inc: { victories: 1 } }, 
                { new: true });
    
            res.json(user);
        }
        catch(e) {
            res.json({ status: 'No session' });
        }
    }

}