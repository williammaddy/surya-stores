const Order = require('../models/Order');

/**
 * Generates a human-readable sequential order number (e.g., SURYA-2026-0001)
 */
const generateOrderNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `SURYA-${currentYear}-`;

  // Find the highest existing order number for this year
  const latestOrder = await Order.findOne({
    orderNumber: new RegExp(`^${prefix}`),
  })
    .sort({ createdAt: -1 })
    .select('orderNumber');

  let nextSequence = 1;

  if (latestOrder && latestOrder.orderNumber) {
    const parts = latestOrder.orderNumber.split('-');
    if (parts.length === 3) {
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) {
        nextSequence = lastSeq + 1;
      }
    }
  }

  // Pad sequence to 4 digits (e.g., 0001, 0002)
  const formattedSeq = String(nextSequence).padStart(4, '0');
  return `${prefix}${formattedSeq}`;
};

module.exports = generateOrderNumber;
