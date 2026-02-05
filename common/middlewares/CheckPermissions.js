const sequelize = require('../database');
const defineUser = require('../models/User');
const User = defineUser(sequelize);

/**
 * Authorization middleware factory - Checks user role permissions
 * - Retrieves authenticated user from database
 * - Verifies user has the required role for accessing the route
 * - Returns 403 Forbidden if user lacks required permissions
 * - Calls next() if authorized to proceed to route handler
 * Usage: checkPermissions.has('ADMIN') to require admin role
 * @param {string} requiredRole - The required role (e.g., 'ADMIN', 'MANAGER')
 * @returns {Function} Express middleware function
 */
exports.has = (requiredRole) => async (req, res, next) => {
    const user = await User.findByPk(req.user.userId);
    if (!user || user.role !== requiredRole) {
        return res.status(403).json({ error: `Requires ${requiredRole} role` });
    }
    next();
};