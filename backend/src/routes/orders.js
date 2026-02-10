const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.use(authenticateToken);

router.post('/', orderController.placeOrder);
router.get('/', orderController.listOrders);
router.get('/:id', orderController.getOrder);

module.exports = router;
