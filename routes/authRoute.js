const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.Controllers');

router.post('/auth/signup', authController.signup);
router.post('/auth/verify-email', authController.verifyEmail);
router.post('/auth/singin', authController.singin);
router.post('/auth/forget-password', authController.forgetPassword);
router.post('/auth/reset-password', authController.resetPassword);

module.exports = router;