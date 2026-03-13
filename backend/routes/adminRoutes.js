const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const Order = require('../models/Order');

// Admin login (public)
router.post('/login', authController.adminLogin);

// Protected admin routes
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    
    const orders = await Order.find(filter)
      .populate('items.menuItemId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

router.patch('/orders/:id/status', authMiddleware, authController.updateOrderStatus);
router.patch('/orders/:id/verify-payment', authMiddleware, authController.verifyPayment);

module.exports = router;
