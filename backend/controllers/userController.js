const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Settings = require('../models/Settings');

// @desc    Get all customers with order statistics (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNumber - 1) * pageSize;

    const query = { role: 'customer' };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const [total, customers] = await Promise.all([
      User.countDocuments(query),
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
    ]);

    // Aggregate order counts & totals per customer
    const customerIds = customers.map((c) => c._id);
    const orderAggregates = await Order.aggregate([
      { $match: { customer: { $in: customerIds } } },
      {
        $group: {
          _id: '$customer',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$total' },
        },
      },
    ]);

    const orderMap = {};
    orderAggregates.forEach((agg) => {
      orderMap[agg._id.toString()] = {
        orderCount: agg.orderCount,
        totalSpent: agg.totalSpent,
      };
    });

    const enrichedCustomers = customers.map((c) => ({
      id: c._id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      createdAt: c.createdAt,
      orderCount: orderMap[c._id.toString()]?.orderCount || 0,
      totalSpent: orderMap[c._id.toString()]?.totalSpent || 0,
    }));

    res.json({
      success: true,
      data: enrichedCustomers,
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

// @desc    Get customer details + past orders (Admin)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getCustomerDetails = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    const orders = await Order.find({ customer: customer._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        customer,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comprehensive admin dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    const lowStockThreshold = settings.lowStockThreshold || 10;

    const [
      totalProducts,
      totalCategories,
      totalCustomers,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      completedOrders,
      cancelledOrders,
      revenueResult,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Confirmed' }),
      Order.countDocuments({ status: 'Completed' }),
      Order.countDocuments({ status: 'Cancelled' }),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(6).populate('customer', 'name phone'),
      Product.find({ stock: { $lte: lowStockThreshold }, isActive: true })
        .populate('category', 'name')
        .sort({ stock: 1 })
        .limit(8),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalCustomers,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue,
        recentOrders,
        lowStockProducts,
        lowStockThreshold,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomerDetails,
  getDashboardStats,
};
