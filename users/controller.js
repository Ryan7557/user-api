const sequelize = require('../common/database');
const defineUser = require('../common/models/User');
const User = defineUser(sequelize);

/**
 * Get authenticated user's profile information
 * - Retrieves the authenticated user's record from database using userId from JWT token
 * - Returns user data including id, username, email, firstName, lastName, role, age
 * - Returns 404 if user record not found in database
 * - Requires authentication middleware (IsAuthenticated.check)
 * @param {Object} req - Express request with user info attached by auth middleware
 * @param {Object} res - Express response object
 */
const getUser = async (req, res) => {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: user });
};

/**
 * Retrieve all user accounts from database
 * - Fetches all user records
 * - Returns array of all users with their profile information
 * - Requires authentication and ADMIN role
 * - Used for admin panels, user management, or analytics features
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.json({ success: true, data: users });
}

module.exports = {
    getUser,
    getAllUsers
}