const router = require('express').Router();
const UserController = require('./controller')
const check = require('../common/middlewares/IsAuthenticated');
const checkPermissions = require('../common/middlewares/CheckPermissions');

router.get('/', check, UserController.getUser);
router.get('/all', check, checkPermissions.has('ADMIN'), UserController.getAllUsers);

module.exports = router;