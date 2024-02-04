const router = require('express').Router();
const userController = require('../controllers/userController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/me').get(isAuthenticatedUser, userController.getUserProfile)
router.route('/password/update').put(isAuthenticatedUser, userController.updatePassword)
router.route('/me/update').put(isAuthenticatedUser, userController.updateUser)
router.route('/me/delete').delete(isAuthenticatedUser, userController.deleteUser)

module.exports = router