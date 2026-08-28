const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'Surya Stores',
      trim: true,
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
      trim: true,
    },
    whatsAppNumber: {
      type: String,
      default: '+91 98765 43210',
      trim: true,
    },
    email: {
      type: String,
      default: 'info@suryastores.com',
      trim: true,
    },
    address: {
      type: String,
      default: '17, Kamatchiamman Koil Street, Tiruppur - 641604',
      trim: true,
    },
    businessHours: {
      type: String,
      default: 'Mon - Sat: 9:00 AM - 9:30 PM | Sun: 10:00 AM - 2:00 PM',
      trim: true,
    },
    aboutText: {
      type: String,
      default:
        'Surya Stores is your premier local destination for high-quality stationery, academic school guides, office supplies, art materials, and educational toys.',
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Singleton helper to get or initialize store settings
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
