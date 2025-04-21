const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const verifyToken = require('../middleware/verifyToken');
const { submitOrder, editStatus, getAllOrders, getPendingOrders } = require('../controllers/orderController');

router.get('/', isAdmin, getAllOrders);
router.get('/pending', isAdmin, getPendingOrders);
router.post('/submit', verifyToken, submitOrder);
router.patch('/:id/status', isAdmin, editStatus);

module.exports = router;
