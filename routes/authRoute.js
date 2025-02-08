const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.Controllers');

router.post('/auth/signup', authController.signup);
router.post('/auth/verify-email', authController.verifyEmail);


module.exports = router;