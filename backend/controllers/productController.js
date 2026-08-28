const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with searching, filtering, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      featured,
      sort = 'newest',
      page = 1,
      limit = 12,
      all = 'false',
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNumber - 1) * pageSize;

    // Build Mongoose filter
    const query = {};

    // Customer vs Admin view
    if (all !== 'true') {
      query.isActive = true;
    }

    // Category filter (support category slug or category ObjectId)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catObj = await Category.findOne({ slug: category });
        if (catObj) {
          query.category = catObj._id;
        } else {
          // If category slug not found, return empty results
          return res.json({
            success: true,
            data: [],
            pagination: { total: 0, page: pageNumber, totalPages: 0, limit: pageSize },
          });
        }
      }
    }

    // Brand filter
    if (brand && brand !== 'all') {
      query.brand = brand;
    }

    // Keyword search across name, description, and brand
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { description: searchRegex }, { brand: searchRegex }];
    }

    // Price range filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(minPrice)) query.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(maxPrice)) query.price.$lte = Number(maxPrice);
    }

    // In Stock Only
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    switch (sort) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'name_asc':
        sortOptions = { name: 1 };
        break;
      case 'name_desc':
        sortOptions = { name: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize),
    ]);

    res.json({
      success: true,
      data: products,
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

// @desc    Get single product details with related products
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Fetch related products from the same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .populate('category', 'name slug')
      .limit(4);

    res.json({
      success: true,
      data: {
        ...product.toObject(),
        relatedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, image, brand, sku, isActive, featured } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Product name is required.' });
    }
    if (price === undefined || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'Valid positive price is required.' });
    }
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category reference is required.' });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Selected category does not exist.' });
    }

    // Auto-generate SKU if omitted
    const generatedSku =
      sku && sku.trim() !== ''
        ? sku.trim().toUpperCase()
        : `SURYA-${Math.floor(100000 + Math.random() * 900000)}`;

    const product = await Product.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      price: Number(price),
      stock: parseInt(stock, 10) || 0,
      category,
      image: image || '',
      brand: brand ? brand.trim() : 'General',
      sku: generatedSku,
      isActive: isActive !== undefined ? isActive : true,
      featured: Boolean(featured),
    });

    const populated = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, image, brand, sku, isActive, featured } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ success: false, message: 'Selected category does not exist.' });
      }
      product.category = category;
    }

    if (name !== undefined) product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = parseInt(stock, 10);
    if (image !== undefined) product.image = image;
    if (brand !== undefined) product.brand = brand.trim();
    if (sku !== undefined) product.sku = sku.trim().toUpperCase();
    if (isActive !== undefined) product.isActive = Boolean(isActive);
    if (featured !== undefined) product.featured = Boolean(featured);

    await product.save();
    const updated = await Product.findById(product._id).populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Product "${product.name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick stock update
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
const updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || isNaN(stock) || Number(stock) < 0) {
      return res.status(400).json({ success: false, message: 'Valid non-negative stock number required.' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: parseInt(stock, 10) },
      { new: true }
    ).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({
      success: true,
      message: `Stock updated for "${product.name}".`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
};
