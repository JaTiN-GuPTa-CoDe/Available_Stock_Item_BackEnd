const { Admin } = require('../models/AdminModel');
const { ShopOwner } = require('../models/ShopOwnerModel');
const { Product } = require('../models/ProductModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/Token');

// Admin Signup
exports.adminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ name, email, password: hashedPassword });
        await admin.save();
        // Generate token
        const token = generateToken(admin._id);

        res.status(201).json({
            message: 'Admin created successfully',
            admin, token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ error: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate token
        const token = generateToken(admin._id);

        // Set the token in a cookie
        res.cookie('AdminToken', token, { httpOnly: true });

        res.json({
            message: 'Admin Login Successful', token, admin
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add Product
exports.addProduct = async (req, res) => {
    try {
        const { productname, description, price, category, stock } = req.body;
        const product = new Product({
            productname,
            description,
            price,
            category,
            stock,
            imageUrl: req.file ? req.file.filename : undefined,
        });
        await product.save();

        res.status(201).json({
            message: 'Product added successfully', product
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Get All Products
exports.getAllProducts=async (req,res)=>{
    try {
        const products = await Product.find();
        res.status(200).json({
            message:'Product Fetch successfully',
            products
        });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

// Get Product by ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from the request params
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product fetched successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Product by ID
exports.updateProductById = async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from the request params
        const { productname, description, price, category, stock } = req.body;

        // Find the product by ID
        let product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Update the product details
        product.productname = productname || product.productname;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;

        // Update the image if a new one is provided
        if (req.file) {
            product.imageUrl = req.file.filename;
        }

        // Save the updated product to the database
        await product.save();

        res.status(200).json({
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Product by ID
exports.deleteProductById = async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from the request params

        // Find the product by ID and delete it
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get all ShopOwners
exports.getAllShopOwners = async (req, res) => {
    try {
        const shopOwners = await ShopOwner.find();
        res.json(shopOwners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get ShopOwner by ID
exports.getShopOwnerById = async (req, res) => {
    try {
        const { id } = req.params;
        const shopOwner = await ShopOwner.findById(id);
        if (!shopOwner) {
            return res.status(404).json({ error: 'ShopOwner not found' });
        }
        res.json(shopOwner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete ShopOwner by ID
exports.deleteShopOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const shopOwner = await ShopOwner.findByIdAndDelete(id);
        if (!shopOwner) {
            return res.status(404).json({ error: 'ShopOwner not found' });
        }
        res.json({ message: 'ShopOwner deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify ShopOwner
exports.verifyShopOwner = async (req, res) => {
    try {
        const { shopOwnerId } = req.params;

        // Find the ShopOwner by ID
        const shopOwner = await ShopOwner.findById(shopOwnerId);
        if (!shopOwner) {
            return res.status(404).json({ error: 'ShopOwner not found' });
        }

        // Update the verifyStatus to true
        shopOwner.status = true;
        await shopOwner.save();

        res.json({
            message: 'ShopOwner verified successfully',
            shopOwner
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loggedOut = (req, res) => {
    const loggedOutStatus = req.cookies.AdminToken;

    if (loggedOutStatus) {
        // Clear the cookie if it exists
        res.clearCookie("AdminToken")
            .status(200)
            .json({ message: "Logged Out Successfully" });
    } else {
        res.status(400).json({ message: "No token found" });
    }
};