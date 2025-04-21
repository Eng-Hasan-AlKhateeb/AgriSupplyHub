const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');

const {
    getAllProducts,
} = require('../controllers/productController');

router.get('/', isAdmin, getAllProducts);

module.exports = router;


