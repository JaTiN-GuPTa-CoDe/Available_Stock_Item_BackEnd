const mongoose = require('mongoose');

const AddProductSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Home', 'Books', 'Others']
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    image: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', AddProductSchema);
module.exports = { Product };
