const jwt = require('jsonwebtoken');

// Function to generate a token
const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return token;
};

module.exports = { generateToken };
