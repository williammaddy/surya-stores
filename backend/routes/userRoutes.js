const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerDetails, getDashboardStats } = require('../controllers/userController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// All admin routes are Protected with Admin Role
router.use(protect, requireAdmin);

// Dashboard KPI analytics
router.get('/dashboard', getDashboardStats);

// Orders management alias under /api/admin/orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Customers management under /api/admin/customers and /api/admin
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerDetails);
router.get('/', getCustomers);
router.get('/:id', getCustomerDetails);

module.exports = router;
