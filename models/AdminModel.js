const mongoose = require('mongoose');
const { ShopOwner } = require('./ShopOwnerModel'); // Import the ShopOwner model

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    },
    shopOwners: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ShopOwner'
    }] ,
    product:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }]
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = { Admin };
