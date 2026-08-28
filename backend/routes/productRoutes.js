const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Public Product routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin Protected Product routes
router.post('/', protect, requireAdmin, createProduct);
router.put('/:id', protect, requireAdmin, updateProduct);
router.delete('/:id', protect, requireAdmin, deleteProduct);
router.patch('/:id/stock', protect, requireAdmin, updateStock);

module.exports = router;
