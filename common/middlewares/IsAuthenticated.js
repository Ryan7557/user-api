const jwt = require('jsonwebtoken');

/**
 * Authentication middleware - Verifies JWT Bearer token
 * - Checks for Authorization header in format: "Bearer <token>"
 * - Validates JWT token signature and expiration using JWT_SECRET
 * - Attaches decoded user info (username, userId) to req.user
 * - Returns 401 if token is missing, malformed, invalid, or expired
 * - Must be used on routes requiring authentication
 * Usage: app.get('/profile', check.check, profileHandler)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware/route handler
 */
const check = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header provided' });
    }
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
        return res.status(401).json({ error: 'Invalid authorization format' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = {
    check,
}