const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const isAdmin = require('../middleware/isAdmin');
const verifyToken = require('../middleware/verifyToken');

const {
    createProduct,
    getAllProducts,
    deleteProduct,
    getProductById,
    rateProduct
} = require('../controllers/productController');

// Define routes
router.get('/', getAllProducts).post('/', isAdmin, upload.single('image'), createProduct);
router.delete('/:id', isAdmin, deleteProduct).get('/:id', getProductById);
router.post('/rate/:productId', verifyToken, rateProduct);

module.exports = router;


