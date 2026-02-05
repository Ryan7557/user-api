// Define user management routes
const router = require('express').Router();
const UserController = require('./controller');
const check = require('../common/middlewares/IsAuthenticated');
const checkPermissions = require('../common/middlewares/CheckPermissions');

// GET / - Get authenticated user's profile (requires authentication)
router.get('/', check.check, UserController.getUser);

// GET /all - Get all users in database (requires authentication and ADMIN role)
router.get('/all', check.check, checkPermissions.has('ADMIN'), UserController.getAllUsers);

module.exports = router;