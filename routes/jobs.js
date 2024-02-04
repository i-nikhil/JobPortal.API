const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/jobs').get(jobsController.getJobs);
router.route('/job/search').get(jobsController.searchJobs);
router.route('/job/new').post(isAuthenticatedUser, authorizeRoles('employer', 'admin'), jobsController.newJob);
router.route('/job/:id/apply').put(isAuthenticatedUser, authorizeRoles('user'), jobsController.applyJob)
router.route('/job/:id')
.get(jobsController.getJobById)
.put(isAuthenticatedUser, authorizeRoles('employer', 'admin'), jobsController.updateJob)
.delete(isAuthenticatedUser, authorizeRoles('employer', 'admin'), jobsController.deleteJob);

module.exports = router;