const { ShopOwner } = require('../models/ShopOwnerModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/Token'); 

// ShopOwner Signup
exports.shopOwnerSignup = async (req, res) => {
    try {
        const { name, email, password, shopName, address, contactNumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const shopOwner = new ShopOwner({
            name,
            email,
            password: hashedPassword,
            shopName,
            address,
            contactNumber
        });
        await shopOwner.save();
        // Generate token
        const token = generateToken(shopOwner._id);

        res.status(201).json({
            shopOwner,token,
             message: 'ShopOwner created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ShopOwner Login
exports.shopOwnerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find the shop owner by email
        const shopOwner = await ShopOwner.findOne({ email });
        if (!shopOwner) return res.status(404).json({ error: 'ShopOwner not found' });

        // Check if the shop owner is verified
        if (!shopOwner.status) {
            return res.status(403).json({ error: 'Your account is not verified yet. Please wait for admin verification.' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, shopOwner.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Generate token
        const token = generateToken(shopOwner._id, false); // Assuming shopOwner is not an admin

        // Respond with the token and shop owner details
        res.json({
            message: 'ShopOwner Login Successful',
            token,
            shopOwner
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loggedOut = (req, res) => {
    const loggedOutStatus = req.cookies.ShopOwnerToken;

    if (loggedOutStatus) {
        // Clear the cookie if it exists
        res.clearCookie("ShopOwnerToken")
            .status(200)
            .json({ message: "Logged Out Successfully" });
    } else {
        res.status(400).json({ message: "No token found" });
    }
};