require('dotenv').config();

const express = require('express');
const app = express();
const sequelize = require('./common/database');
const defineUser = require('./common/models/User');
const User = defineUser(sequelize);
const authRoutes = require('./authorization/routes');

// sync database
sequelize.sync();

app.use(express.json());
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.json({
        status: 'Running',
        timestamp: new Date().toISOString(),
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
