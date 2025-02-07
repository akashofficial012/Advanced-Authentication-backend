const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.Controllers');

router.post('/auth/signup', authController.signup);


module.exports = router;