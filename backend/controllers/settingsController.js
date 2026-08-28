const Settings = require('../models/Settings');

// @desc    Get store settings & contact information
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update store settings & contact information
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res, next) => {
  try {
    const {
      storeName,
      phone,
      whatsAppNumber,
      email,
      address,
      businessHours,
      aboutText,
      logo,
      socialLinks,
      lowStockThreshold,
    } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (storeName !== undefined) settings.storeName = storeName.trim();
    if (phone !== undefined) settings.phone = phone.trim();
    if (whatsAppNumber !== undefined) settings.whatsAppNumber = whatsAppNumber.trim();
    if (email !== undefined) settings.email = email.trim();
    if (address !== undefined) settings.address = address.trim();
    if (businessHours !== undefined) settings.businessHours = businessHours.trim();
    if (aboutText !== undefined) settings.aboutText = aboutText.trim();
    if (logo !== undefined) settings.logo = logo;
    if (socialLinks !== undefined) settings.socialLinks = socialLinks;
    if (lowStockThreshold !== undefined) settings.lowStockThreshold = Number(lowStockThreshold);

    await settings.save();

    res.json({
      success: true,
      message: 'Store settings updated successfully.',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
