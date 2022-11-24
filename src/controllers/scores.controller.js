User = require('../models/user.model');

module.exports = {

    getAll: async (req, res) => {

        const scores = await User.find({}, { username: 1, victories: 1 }).sort({ 'victories': -1 });
        res.json(scores);
    
    }
    
}