const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const submitOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate({
            path: 'cart.product',
            select: 'name price quantity',
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        for (const item of user.cart) {
            const product = await Product.findById(item.product._id);
            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for product: ${product.name}`,
                });
            }
        }

        let totalPrice = 0;
        const orderItems = user.cart.map((cartItem) => {
            if (!cartItem.product) {
                throw new Error('Invalid product in cart');
            }
            totalPrice += cartItem.product.price * cartItem.quantity;
            
            return {
                product: cartItem.product._id,
                quantity: cartItem.quantity,
            };
        });
        
        for (const item of user.cart) {
            const product = await Product.findById(item.product._id);
            product.quantity -= item.quantity;
            await product.save();
        }

        const newOrder = await Order.create({
            user: userId,
            items: orderItems,
            totalPrice, 
        });

        user.cart = [];
        await user.save();

        res.status(201).json({
            message: 'Order submitted successfully',
            order: newOrder,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const editStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = order.status === 'Pending' ? 'Delivered' : 'Pending';

        await order.save();

        res.status(200).json({
            message: 'Order status updated successfully',
            order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product', 'name price');

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPendingOrders = async (req, res) => {
    try {
        const pendingOrders = await Order.find({ status: 'Pending' })
            .populate('user', 'name email')
            .populate('items.product', 'name price');

        if (pendingOrders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.status(200).json({
            message: 'Orders retrieved successfully',
            pendingOrders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { submitOrder, editStatus, getAllOrders, getPendingOrders };
