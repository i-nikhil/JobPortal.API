const authController = require('../controllers/authController');
const router = require('express').Router();
const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/register').post(authController.registerUser)
router.route('/login').post(authController.loginUser)
router.route('/logout').get(isAuthenticatedUser, authController.logout)

module.exports = router;