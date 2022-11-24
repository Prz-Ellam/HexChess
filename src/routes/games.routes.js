const express = require('express');
const router = express.Router();
const games = require('../controllers/games.controller');

router.post('/', games.save);

module.exports = router;