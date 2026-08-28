const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters.'],
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required.'],
      min: [0, 'Price cannot be negative.'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required.'],
      min: [0, 'Stock cannot be negative.'],
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required.'],
    },
    image: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      trim: true,
      default: 'General',
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for search performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });

// Auto-generate slug from name if needed
productSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.slug =
      this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      randomSuffix;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
