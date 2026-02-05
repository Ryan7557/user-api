// Define authentication routes
const router = require('express').Router();
const AuthController = require('./controller');

// POST /signup - Register a new user account
router.post('/signup', AuthController.register);

// POST /login - Authenticate user and receive JWT token
router.post('/login', AuthController.login);

module.exports = router;