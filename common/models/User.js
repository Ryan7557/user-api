// User database model/schema definition using Sequelize
// Defines the structure and properties for user records in the database
const { DataTypes } = require('sequelize');

const UserModel = {
    id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true
    },
    email: {
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    role: {
        type: DataTypes.STRING, 
        defaultValue: 'USER'
    },
    age: {
        type: DataTypes.INTEGER
    }
}

// Factory function that creates and returns the User model for a Sequelize instance
module.exports = (sequelize) => sequelize.define('user', UserModel)