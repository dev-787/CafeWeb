const Order = require('../models/Order');
const { generateUPIQR } = require('../utils/generateQR');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { customerName, phone, tableNumber, items, totalAmount } = req.body;
    
    // Validate request body
    if (!customerName || !phone || !tableNumber || !items || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }
    
    // Create order
    const order = await Order.create({
      customerName,
      phone,
      tableNumber,
      items,
      totalAmount,
      paymentMethod: 'upi_qr',
      paymentStatus: 'pending',
      status: 'pending'
    });
    
    // Generate QR code
    const paymentQR = await generateUPIQR(totalAmount);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order._id,
        totalAmount: order.totalAmount,
        paymentQR,
        upiId: process.env.UPI_ID,
        cafeName: process.env.CAFE_NAME
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Submit payment UTR
exports.submitPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { utr } = req.body;
    
    if (!utr || utr.trim().length < 12) {
      return res.status(400).json({
        success: false,
        message: 'Valid UTR number is required (minimum 12 characters)'
      });
    }
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment already submitted for this order'
      });
    }
    
    order.utr = utr.trim();
    order.paymentStatus = 'verification_pending';
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment submitted successfully. Awaiting verification.',
      data: {
        orderId: order._id,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error submitting payment',
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id).populate('items.menuItemId');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};
