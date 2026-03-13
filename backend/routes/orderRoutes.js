const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Customer routes
router.post('/', orderController.createOrder);
router.patch('/:id/payment', orderController.submitPayment);
router.get('/:id', orderController.getOrderById);

module.exports = router;
