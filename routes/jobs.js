const express = require('express');
const router = express.Router();

//Importing jobs controller
const jobsController = require('../controllers/jobsController');

router.route('/jobs').get(jobsController.getJobs);
router.route('/job/new').post(jobsController.newJob);
router.route('/job/search').get(jobsController.searchJobs);
router.route('/job/:id').get(jobsController.getJobById).put(jobsController.updateJob).delete(jobsController.deleteJob);
module.exports = router;