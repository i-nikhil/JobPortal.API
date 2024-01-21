const Job = require('../models/jobs');

//Get all Jobs => /api/v1/jobs
exports.getJobs = async (req, res, next) => {
    const jobs = await Job.find();
    res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
    });
}

//Create a new Job => /api/v1/job/new
exports.newJob = async (req, res, next) => {
    const job = await Job.create(req.body);
    res.status(201).json({
        success: true,
        message: 'Job Created.',
        data: job
    });
}