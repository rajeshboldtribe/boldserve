const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Create payment
router.post('/create', async (req, res) => {
    try {
        const { amount, customerName, customerEmail, customerPhone } = req.body;
        const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const payment = new Payment({
            orderId,
            amount,
            customerName,
            customerEmail,
            customerPhone,
            status: 'created'
        });
        
        await payment.save();
        res.json({ success: true, data: payment });
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }
        res.json({ success: true, data: payment });
    } catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update payment status
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }
        res.json({ success: true, data: payment });
    } catch (error) {
        console.error('Update payment error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete payment
router.delete('/:id', async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }
        res.json({ success: true, message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Delete payment error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router; 