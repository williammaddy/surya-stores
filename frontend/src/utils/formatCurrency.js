/**
 * Formats a number into Indian Rupee format (e.g. ₹1,499.00 or ₹99.00)
 */
export const formatCurrency = (amount) => {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

export default formatCurrency;
