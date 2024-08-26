const jwt = require('jsonwebtoken');

const Authorization = (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({ error: "please login first" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized user" });
        }
        req.admin = decoded;  // Store the decoded token in req.admin
        next();
    });
}

module.exports = { Authorization }
