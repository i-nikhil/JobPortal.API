const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/jobs').get(jobsController.getJobs);
router.route('/job/search').get(jobsController.searchJobs);
router.route('/job/new').post(isAuthenticatedUser, jobsController.newJob);
router.route('/job/:id').get(jobsController.getJobById).put(isAuthenticatedUser, jobsController.updateJob).delete(isAuthenticatedUser, jobsController.deleteJob);
module.exports = router;