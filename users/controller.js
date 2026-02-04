const sequelize = require('./common/database');
const defineUser = require('./common/models/User');
const User = defineUser(sequelize);

const getUser = async (req, res) => {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: user });
};

const getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.json({ success: true, data: users });
}

module.exports = {
    getUser,
    getAllUsers
}