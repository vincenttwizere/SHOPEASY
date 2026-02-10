const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', productController.list);
router.get('/:id', productController.getById);

// Admin routes
router.post('/', authenticateToken, requireRole('admin'), productController.create);
router.put('/:id', authenticateToken, requireRole('admin'), productController.update);
router.delete('/:id', authenticateToken, requireRole('admin'), productController.remove);

module.exports = router;
