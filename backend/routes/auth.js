const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/google', authController.googleLogin);
router.post('/truecaller', authController.truecallerLogin);
router.post('/guest', authController.guestLogin);
router.get('/profile', authController.getProfile);

module.exports = router;
