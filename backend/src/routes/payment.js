const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  handleWebhook,
  processRwandanPayment
} = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Create payment intent (requires auth)
router.post('/create-intent', authenticateToken, createPaymentIntent);

// Confirm payment and create order (requires auth)
router.post('/confirm', authenticateToken, confirmPayment);

// Get payment status (requires auth)
router.get('/status/:paymentIntentId', authenticateToken, getPaymentStatus);

// Rwandan payment processing (requires auth)
router.post('/rwandan', authenticateToken, processRwandanPayment);

// Webhook endpoint (does not require auth)
router.post('/webhook', handleWebhook);

module.exports = router;
