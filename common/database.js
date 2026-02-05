// Initialize SQLite database connection using Sequelize ORM
// Database file is stored in ./storage/data.db
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './storage/data.db'
});

module.exports = sequelize;