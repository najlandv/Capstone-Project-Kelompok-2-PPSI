const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { isLogin } = require('../middleware/UserMiddleware');

router.get('/login', isLogin, authController.loginForm)
router.post('/login', authController.loginUser)
router.get('/register', isLogin, authController.registerForm)
router.post('/register', authController.registerUser)
router.post('/logout', authController.logoutUser)

module.exports = router