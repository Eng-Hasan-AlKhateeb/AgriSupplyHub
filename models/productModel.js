const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a product name'],
            trim: true,
            min: 3,
            max: 30
        },
        description: {
            type: String,
            required: [true, 'Please add a product description'],
            trim: true,
            min: 5,
            max: 100
        },
        price: {
            type: Number,
            required: [true, 'Please add a product price'],
            min: [0, 'Price cannot be negative'],
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%'],
        },
        rating: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                value: {
                    type: Number,
                    required: true,
                    min: [0, 'Rating must be at least 0'],
                    max: [5, 'Rating must not exceed 5'],
                },
            },
        ],
        image: {
            type: String,
            required: [true, 'Please add an image path'],
            validate: {
                validator: (path) => /^images\/.+$/.test(path),
                message: 'Image path must start with "images/"',
            },
        },
        quantity: {
            type: Number,
            required: [true, 'Please add the product quantity'],
            min: [0, 'Quantity cannot be negative'],
        },
    },
    {
        timestamps: true,
    }
);

productSchema.virtual('averageRating').get(function () {
    if (this.rating.length === 0) return 0;
    const total = this.rating.reduce((acc, obj) => acc + obj.value, 0);
    return total / this.rating.length;
});

module.exports = mongoose.model('Product', productSchema);
