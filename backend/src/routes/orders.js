const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.use(authenticateToken);

router.post('/', orderController.placeOrder);
router.get('/', orderController.listOrders);
router.get('/:id', orderController.getOrder);

// Admin routes
router.get('/admin/all', requireRole('admin'), orderController.getAllOrders);
router.patch('/admin/:id/status', requireRole('admin'), orderController.updateOrderStatus);
router.get('/admin/stats', requireRole('admin'), orderController.getUserStats);

module.exports = router;
