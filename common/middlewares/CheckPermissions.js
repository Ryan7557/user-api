const sequelize = require('../database');
const defineUser = require('../models/User');
const User = defineUser(sequelize);

exports.has = (requiredRole) => async (req, res, next) => {
    const user = await User
}