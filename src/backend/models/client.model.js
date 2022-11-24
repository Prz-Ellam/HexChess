const { Schema, model } = require('mongoose');

const clientSchema = new Schema({
    _id: {
        type: String
    }
});

module.exports = model('Client', clientSchema);
// id