const { Schema, model } = require('mongoose');

const gameSchema = new Schema({
    code:{
        type: String
    },
    redPlayer: {
        type: String
    },
    greenPlayer: {
        type: String
    },
    configuration: {
        type: Object
    },
    redReady: {
        type: Boolean
    },
    greenReady: {
        type: Boolean
    },
    turn: {
        type: String
    },
    interval: {
        type: Object
    },
    redComplete: {
        type: Boolean
    },
    greenComplete: {
        type: Boolean
    }
});

module.exports = model('Game', gameSchema);