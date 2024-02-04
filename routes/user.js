const router = require('express').Router();
const userController = require('../controllers/userController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/me').get(isAuthenticatedUser, userController.getUserProfile)

module.exports = router