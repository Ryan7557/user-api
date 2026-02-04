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

const encryptPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');
const generateAccessToken = (username, userId) => 
    jwt.sign({ username, userId }, SECRET_KEY, { expiresIn: '24h' });
const register = async (req, res) => {
    try {
        if (!validate(req.body)) {
            return res.status(400).json({ error: 'Invalid input', details: validate.errors });``
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

module.exports = {
    register,
};