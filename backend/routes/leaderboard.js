const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

router.get('/daily', leaderboardController.getDailyLeaderboard);
router.get('/alltime', leaderboardController.getAllTimeLeaderboard);

module.exports = router;
