User = require('../models/user.model');

module.exports = {

    getAll: async (req, res) => {

        try {
            //const scores = await User.find({}, { username: 1, victories: 1 }).sort({ 'victories': -1 });
            //console.log(scores);
            res.json({status: true});
        }
        catch (e) {
            res.json({ status: false });
        }
    
    }
    
}