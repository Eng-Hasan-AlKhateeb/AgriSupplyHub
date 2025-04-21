const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, getCart);
router.post('/add/:id', verifyToken, addToCart);
router.delete('/remove/:id', verifyToken, removeFromCart);

module.exports = router;
 