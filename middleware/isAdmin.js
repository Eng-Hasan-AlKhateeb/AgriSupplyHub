const jwt = require('jsonwebtoken');

const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied, admin only' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token verification failed, not authorized' });
    }
};

module.exports = isAdmin;
