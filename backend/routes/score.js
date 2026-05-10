const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const scoreController = require('../controllers/scoreController');

router.post('/submit', authMiddleware, scoreController.submitScore);

module.exports = router;
