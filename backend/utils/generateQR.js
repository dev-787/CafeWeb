const QRCode = require('qrcode');

/**
 * Generate UPI QR code for payment
 * @param {Number} amount - Payment amount
 * @returns {Promise<String>} - QR code data URL
 */
const generateUPIQR = async (amount) => {
  try {
    const upiId = process.env.UPI_ID || 'devcafe@upi';
    const cafeName = process.env.CAFE_NAME || 'DevCafe';
    
    // UPI payment URL format
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(cafeName)}&am=${amount}&cu=INR`;
    
    // Generate QR code as data URL
    const qrDataURL = await QRCode.toDataURL(upiLink, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrDataURL;
  } catch (error) {
    console.error('QR Generation Error:', error);
    throw new Error('Failed to generate QR code');
  }
};

module.exports = { generateUPIQR };
