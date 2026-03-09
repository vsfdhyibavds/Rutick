const express = require('express');
const { register, login, refreshToken, forgotPassword, resetPassword, logout, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);

module.exports = router;
