const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Customer Protected Order routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin Protected Order routes
router.get('/', protect, requireAdmin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, requireAdmin, updateOrderStatus);

module.exports = router;
