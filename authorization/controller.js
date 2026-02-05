const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const sequelize = require('../common/database');
const defineUser = require('../common/models/User');
const { type } = require('os');
const User = defineUser(sequelize);

const ajv = new Ajv();
addFormats(ajv);

const schema = {
    type: 'object',
    required: ['username', 'email', 'password'],
    properties: {
        username: { type: 'string', minLength: 3 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 }
    }
};
const validate = ajv.compile(schema);

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function: Encrypts a password using SHA256 hashing
const encryptPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

// Helper function: Generates a JWT access token with 24-hour expiration
const generateAccessToken = (username, userId) => 
    jwt.sign({ username, userId }, SECRET_KEY, { expiresIn: '24h' });
/**
 * Register a new user account
 * - Validates input data against schema (username, email, password required)
 * - Encrypts password using SHA256
 * - Creates new user record in database with profile information
 * - Generates JWT token for immediate authentication after registration
 * - Returns user info and token on successful registration
 * @param {Object} req - Express request with username, email, password, firstName, lastName, age
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
    try {
        if (!validate(req.body)) {
            return res.status(400).json({ error: 'Invalid input', details: validate.errors });
        }

        const { username, email, password, firstName, lastName, age } = req.body;
        const encryptedPassword = encryptPassword(password);
        const user = await User.create({
            username,
            email,
            password: encryptedPassword,
            firstName,
            lastName,
            age,
        });
        const accessToken = generateAccessToken(username, user.id);
        res.status(201).json({
            success: true,
            user: { id: user.id, username: user.username, email: user.email },
            token: accessToken
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, error: err.message });
    } 
};

/**
 * Authenticate user with username and password
 * - Finds user by username in database
 * - Validates password by comparing encrypted version with stored hash
 * - Generates JWT token on successful authentication
 * - Returns 401 if user not found or password is incorrect
 * @param {Object} req - Express request with username and password in body
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const encrypted = encryptPassword(password);
        const user = await User.findOne({ where: {username} });

        if (!user || user.password !== encrypted) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const token = generateAccessToken(username, user.id);
        res.json({ success: true, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    register,
    login
};