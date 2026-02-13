const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

// All analytics routes require admin authentication
router.get('/sales-trends', authenticateToken, requireRole('admin'), analyticsController.getSalesTrends);
router.get('/top-products', authenticateToken, requireRole('admin'), analyticsController.getTopProducts);
router.get('/product-performance', authenticateToken, requireRole('admin'), analyticsController.getProductPerformance);
router.get('/revenue-by-category', authenticateToken, requireRole('admin'), analyticsController.getRevenueByCategory);
router.get('/low-stock', authenticateToken, requireRole('admin'), analyticsController.getLowStock);
router.get('/recent-orders', authenticateToken, requireRole('admin'), analyticsController.getRecentOrders);

module.exports = router;
