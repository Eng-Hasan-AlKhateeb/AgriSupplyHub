const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const path = require('path');
const fs = require('fs');

const createProduct = async (req, res) => {
    try {
        const { name, description, price, discount, quantity } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        const imagePath = `images/${req.file.filename}`;

        const product = new Product({
            name,
            description,
            price,
            discount,
            quantity,
            image: imagePath,
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .select('-__v')
            .lean();

        const productsWithRatings = products.map((product) => ({
            ...product,
            averageRating: product.rating.length
                ? product.rating.reduce((sum, r) => sum + r.value, 0) / product.rating.length
                : 0,
        }));

        res.status(200).json({
            success: true,
            count: productsWithRatings.length,
            products: productsWithRatings,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to fetch products',
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const imagePath = path.join(__dirname, '../', product.image);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete product',
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId).populate('rating.user', 'name email'); // Populate user info in ratings if needed

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const rateProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { rating } = req.body;

        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 0 and 5' });
        }

        const deliveredOrders = await Order.find({
            user: userId,
            status: 'Delivered',
            'items.product': productId,
        });

        if (deliveredOrders.length === 0) {
            return res
                .status(403)
                .json({ message: 'You can only rate products you have purchased and are delivered' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const existingRating = product.rating.find((r) => r.user.toString() === userId);
        if (existingRating) {
            existingRating.value = rating;
        } else {
            product.rating.push({ user: userId, value: rating });
        }

        await product.save();

        res.status(200).json({
            message: 'Product rated successfully',
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getProductById, getAllProducts, createProduct, deleteProduct, rateProduct };
