const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Public read store settings
router.get('/', getSettings);

// Admin update store settings
router.put('/', protect, requireAdmin, updateSettings);

module.exports = router;
