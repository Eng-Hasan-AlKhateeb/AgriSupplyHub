const Product = require('../models/productModel');
const User = require('../models/userModel');

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const quantity = req.body.quantity;
        const productId = req.params.id;

        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }
        const product = await Product.findById(productId); 
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const user = await User.findById(userId);
        const existingItem = user.cart.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }
        await user.save();
        res.status(200).json({ message: 'Product added to cart', cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const user = await User.findById(userId);
        user.cart = user.cart.filter((item) => item.product.toString() !== productId);

        await user.save();
        res.status(200).json({ message: 'Product removed from cart', cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate({
            path: 'cart.product',
            select: 'name price image',
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Cart retrieved successfully',
            cart: user.cart,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { getCart, addToCart, removeFromCart };
