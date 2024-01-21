const Job = require('../models/jobs');

//Create a new Job => /api/v1/job/new
exports.newJob = async (req, res, next) => {
    const job = await Job.create(req.body);
    res.status(201).json({
        success: true,
        message: 'Job Created.',
        data: job
    });
}

//Get all Jobs => /api/v1/jobs
exports.getJobs = async (req, res, next) => {
    const jobs = await Job.find();
    res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
    });
}

//Search Job by any field => /api/v1/jobs
exports.searchJobs = async (req, res, next) => {
    let query = {};

        // Filter jobs by matching title
        if (req.query.title) {
            query.title = { $regex: new RegExp(req.query.title, 'i') };
        }
        // Filter jobs by country
        if (req.query.countryCode) {
            query.countryCode = req.query.countryCode;
        }
        // Filter jobs by matching company
        if (req.query.company) {
            query.company = { $regex: new RegExp(req.query.company, 'i') };
        }
        // Filter jobs by industry list
        if (req.query.industry) {
            // Validate the requested industry list against the predefined list
            const validIndustries = [
                'Business',
                'Information Technology',
                'Banking',
                'Education/Training',
                'Telecommunication',
                'Marketing',
                'Advertising',
                'Others'
            ];

            const selectedIndustries = req.query.industry.split(',');

            // Filter out invalid industries and include only the valid ones
            const validSelectedIndustries = selectedIndustries.filter(industry =>
                validIndustries.includes(industry)
            );

            if (validSelectedIndustries.length > 0) {
                query.industry = { $in: validSelectedIndustries };
            }
        }
        // Filter jobs by job type
        if (req.query.jobType) {
            query.jobType = req.query.jobType;
        }
        // Filter jobs by minimum education
        if (req.query.minEducation) {
            query.minEducation = req.query.minEducation;
        }
        // Filter jobs by experience
        if (req.query.experience) {
            query.experience = req.query.experience;
        }
        // Check if salary parameter exists and add it to the query object
        if (req.query.salary) {
            const minSalary = parseInt(req.query.salary, 10) || 0;
            query.salary = { $gte: minSalary };
        }

        const jobs = await Job.find(query);

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
}