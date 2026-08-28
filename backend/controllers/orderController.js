const Order = require('../models/Order');
const Product = require('../models/Product');
const generateOrderNumber = require('../utils/generateOrderNumber');
const { sendOrderConfirmation, sendNewOrderAdminNotification } = require('../utils/email');

// @desc    Submit a new order request
// @route   POST /api/orders
// @access  Private (Customer & Admin)
const createOrder = async (req, res, next) => {
  try {
    const { items, customerDetails, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please add products before submitting an order.',
      });
    }

    if (
      !customerDetails ||
      !customerDetails.name ||
      !customerDetails.phone ||
      !customerDetails.address
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete customer details (Name, Phone Number, Delivery Address).',
      });
    }

    // ------------------------------------------------------------------------
    // 🔐 CRITICAL SECURITY RULE: Calculate all prices on backend from MongoDB
    // ------------------------------------------------------------------------
    let calculatedSubtotal = 0;
    const verifiedOrderItems = [];

    for (const item of items) {
      const productId = item.product || item.productId || item._id || item.id;
      const quantity = parseInt(item.quantity, 10);

      if (!productId || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item or quantity format in order request.',
        });
      }

      // Fetch fresh product data from MongoDB
      const dbProduct = await Product.findById(productId);

      if (!dbProduct) {
        return res.status(404).json({
          success: false,
          message: `Product not found in store database.`,
        });
      }

      if (!dbProduct.isActive) {
        return res.status(400).json({
          success: false,
          message: `"${dbProduct.name}" is currently unavailable for order.`,
        });
      }

      if (dbProduct.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${dbProduct.name}". Available: ${dbProduct.stock}, Requested: ${quantity}.`,
        });
      }

      const itemSubtotal = dbProduct.price * quantity;
      calculatedSubtotal += itemSubtotal;

      verifiedOrderItems.push({
        product: dbProduct._id,
        productName: dbProduct.name,
        quantity,
        price: dbProduct.price,
        subtotal: itemSubtotal,
        image: dbProduct.image || '',
      });
    }

    // Generate unique human-readable order number (SURYA-2026-0001)
    const orderNumber = await generateOrderNumber();

    // Create Order in MongoDB
    const order = await Order.create({
      orderNumber,
      customer: req.user._id,
      items: verifiedOrderItems,
      subtotal: calculatedSubtotal,
      total: calculatedSubtotal,
      customerDetails: {
        name: customerDetails.name.trim(),
        phone: customerDetails.phone.trim(),
        email: customerDetails.email ? customerDetails.email.trim() : req.user.email,
        address: customerDetails.address.trim(),
      },
      status: 'Pending',
      notes: notes ? notes.trim() : '',
    });

    // Safely decrement product stock in MongoDB
    for (const item of verifiedOrderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Trigger email notifications (asynchronous, non-blocking)
    sendOrderConfirmation(order).catch((e) => console.error('Customer email error:', e));
    sendNewOrderAdminNotification(order).catch((e) => console.error('Admin email error:', e));

    res.status(201).json({
      success: true,
      message: 'Order submitted successfully! Our staff will contact you to confirm delivery.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's own order history
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details with ownership verification
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.id } : { orderNumber: req.params.id };

    const order = await Order.findOne(query).populate('customer', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Security Check: Customers can only view their own orders
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view this order.',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders with filtering & search (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNumber - 1) * pageSize;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { 'customerDetails.name': searchRegex },
        { 'customerDetails.phone': searchRegex },
        { 'customerDetails.email': searchRegex },
      ];
    }

    const [total, orders] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query)
        .populate('customer', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNumber,
        totalPages: Math.ceil(total / pageSize) || 1,
        limit: pageSize,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status lifecycle (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const prevStatus = order.status;

    // If changing to 'Cancelled' from active, restock products
    if (prevStatus !== 'Cancelled' && status === 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Order #${order.orderNumber} status updated to "${status}".`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
