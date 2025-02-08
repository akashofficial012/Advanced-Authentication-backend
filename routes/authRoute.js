const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.Controllers');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/auth/signup', authController.signup);
router.post('/auth/verify-email', authController.verifyEmail);
router.post('/auth/signin', authController.signin);
router.post('/auth/forget-password', authController.forgetPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.get('/auth/logout', authController.logout);
router.get('/auth/user-profile/:id', authMiddleware, authController.getUserProfile);

module.exports = router;