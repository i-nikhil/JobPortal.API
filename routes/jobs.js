const express = require('express');
const router = express.Router();

//Importing jobs controller methods
const { getJobs, newJob, getJobById, searchJobs, updateJob, deleteJob } = require('../controllers/jobsController');

router.route('/jobs').get(getJobs);
router.route('/job/new').post(newJob);
router.route('/job/search').get(searchJobs);
router.route('/job/:id').get(getJobById).put(updateJob).delete(deleteJob);
module.exports = router;