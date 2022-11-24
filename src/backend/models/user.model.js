const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    //_id: {
    //    type: String,
    //    _id: false
    //},
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 20
    },
    password: {
        type: String,
        required: true
    },
    victories: {
        type: Number
    },
    defeats: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = model('User', userSchema);