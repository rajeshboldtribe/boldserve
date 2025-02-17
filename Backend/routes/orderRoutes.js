const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// Get orders by status (accepted/cancelled)
router.get('/status/:status', orderController.getOrdersByStatus);

module.exports = router; 