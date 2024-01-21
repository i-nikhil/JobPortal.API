const express = require('express');
const router = express.Router();

//Importing jobs controller methods
const { getJobs, newJob, searchJobs } = require('../controllers/jobsController');

router.route('/jobs').get(getJobs);
router.route('/job/new').post(newJob);
router.route('/job/search').get(searchJobs);

module.exports = router;