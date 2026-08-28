const nodemailer = require('nodemailer');

/**
 * Creates and configures Nodemailer transport based on environment variables
 */
const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    return null; // Email not configured; fallback to simulation
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

/**
 * Sends order confirmation to customer
 */
const sendOrderConfirmation = async (order) => {
  const transporter = createTransporter();

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px;">
      <h2 style="color: #d97706; text-align: center;">Surya Stores</h2>
      <h3 style="color: #1e293b; text-align: center;">Order Request Received!</h3>
      <p>Hello <strong>${order.customerDetails.name}</strong>,</p>
      <p>Thank you for submitting your order request with <strong>Surya Stores</strong>. Our staff is preparing your items and will call/WhatsApp you shortly to confirm pickup or local delivery.</p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;"><strong>Order Reference:</strong> ${order.orderNumber}</p>
        <p style="margin: 5px 0 0; font-size: 14px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
        <p style="margin: 5px 0 0; font-size: 14px;"><strong>Payment Method:</strong> Cash / UPI on Delivery (No online payment required)</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0; text-align: left;">
            <th style="padding: 8px 0;">Item</th>
            <th style="padding: 8px 0; text-align: center;">Qty</th>
            <th style="padding: 8px 0; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0;">${item.productName}</td>
              <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px 0; text-align: right;">₹${item.subtotal.toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div style="text-align: right; margin-bottom: 20px;">
        <p style="font-size: 18px; font-weight: bold; color: #b45309; margin: 0;">Total Payable: ₹${order.total.toFixed(2)}</p>
      </div>

      <div style="background-color: #fef3c7; padding: 12px; border-radius: 8px; font-size: 13px; color: #92400e; text-align: center;">
        Need instant assistance? Contact us on WhatsApp: <strong>${process.env.WHATSAPP_NUMBER || '+91 98765 43210'}</strong>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log(`📧 [Simulated Email] Order Confirmation sent to customer: ${order.customerDetails.email} for order: ${order.orderNumber}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: `"Surya Stores" <${process.env.EMAIL_USER}>`,
      to: order.customerDetails.email,
      subject: `Order Confirmation #${order.orderNumber} - Surya Stores`,
      html: emailHtml,
    });
    return { success: true };
  } catch (error) {
    console.error('Nodemailer customer email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Sends notification to admin about new customer order
 */
const sendNewOrderAdminNotification = async (order) => {
  const transporter = createTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  if (!transporter || !adminEmail) {
    console.log(`📧 [Simulated Email] New order alert for admin: ${order.orderNumber} by ${order.customerDetails.name}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: `"Surya Stores Notifications" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🚨 New Order Received: #${order.orderNumber} (₹${order.total.toFixed(2)})`,
      html: `
        <p>A new order request has been submitted by <strong>${order.customerDetails.name}</strong> (${order.customerDetails.phone}).</p>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
        <p><strong>Items:</strong> ${order.items.length} product(s)</p>
        <p>Please log in to the Surya Stores Admin Dashboard to confirm and manage this order.</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Nodemailer admin email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmation,
  sendNewOrderAdminNotification,
};
