const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Admin only
router.get('/', authenticateToken, requireRole('admin'), userController.listUsers);

module.exports = router;
