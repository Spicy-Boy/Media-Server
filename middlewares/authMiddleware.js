const jwt = require('jsonwebtoken');
require('dotenv').config()

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        res.redirect("/login", {loginMessage: "You must verify your login!"});
        // return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.redirect("/login", {loginMessage: "You must verify your login!"});
            // return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;
