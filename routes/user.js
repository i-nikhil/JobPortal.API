const router = require('express').Router();
const userController = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/me').get(isAuthenticatedUser, userController.getUserProfile)
router.route('/jobs/applied').get(isAuthenticatedUser, authorizeRoles('user'), userController.getAppliedJobs)
router.route('/jobs/published').get(isAuthenticatedUser, authorizeRoles('employer', 'admin'), userController.getPublishedJobs)
router.route('/users').get(isAuthenticatedUser, authorizeRoles('admin'), userController.getUsers)
router.route('/password/update').put(isAuthenticatedUser, userController.updatePassword)
router.route('/me/update').put(isAuthenticatedUser, userController.updateUser)
router.route('/me/delete').delete(isAuthenticatedUser, userController.deleteUser)
router.route('/user/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), userController.deleteUserById)

module.exports = router