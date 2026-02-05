// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const app = express();
const sequelize = require('./common/database');
const defineUser = require('./common/models/User');
const User = defineUser(sequelize);
const authRoutes = require('./authorization/routes');
const userRoutes = require('./users/routes');

// Synchronize the database with Sequelize models
sequelize.sync();

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount authentication routes (signup, login)
app.use('/', authRoutes);

// Mount user routes (get user profile, get all users)
app.use('/user', userRoutes);

// Global error handling middleware - catches all errors and returns 500 response
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong'
    });
});

// Health check endpoint - returns server status and timestamp
app.get('/', (req, res) => {
    res.json({
        status: 'Running',
        timestamp: new Date().toISOString(),
    });
});

// Start the Express server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
