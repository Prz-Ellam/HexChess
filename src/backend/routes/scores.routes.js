const express = require('express');
const router = express.Router();
const scores = require('../controllers/scores.controller')

router.get('/', scores.getAll);

module.exports = router;