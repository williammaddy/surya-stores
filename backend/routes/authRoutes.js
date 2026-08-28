const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public auth routes
router.post('/register', register);
router.post('/login', login);

// Protected profile routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
