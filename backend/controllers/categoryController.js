const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories with dynamic product count
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };

    const categories = await Category.find(filter).sort({ name: 1 });

    // Aggregate product counts for each category
    const categoryCounts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    categoryCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const categoriesWithCount = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      isActive: cat.isActive,
      productCount: countMap[cat._id.toString()] || 0,
      createdAt: cat.createdAt,
    }));

    res.json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const productCount = await Product.countDocuments({
      category: category._id,
      isActive: true,
    });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        productCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    // Check duplicate
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A category named "${name}" already exists.`,
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      image: image || '',
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;

    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    if (name && name.trim() !== category.name) {
      const duplicate = await Category.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Another category named "${name}" already exists.`,
        });
      }
      category.name = name.trim();
      category.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (description !== undefined) category.description = description.trim();
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category with safety validation
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Safety check: Prevent deletion if products reference this category
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category "${category.name}" because it contains ${productCount} active product(s). Please delete or reassign those products first.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Category "${category.name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
