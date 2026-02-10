const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.use(authenticateToken);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);

module.exports = router;
