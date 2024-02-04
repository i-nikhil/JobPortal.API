const Job = require('../models/jobs');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const path = require('path');

class JobsController {
    constructor() {
        this.newJob = this.newJob.bind(this)
        this.getJobById = this.getJobById.bind(this)
        this.getJobs = this.getJobs.bind(this)
        this.searchJobs = this.searchJobs.bind(this)
        this.updateJob = this.updateJob.bind(this)
        this.deleteJob = this.deleteJob.bind(this)
        this.applyJob = this.applyJob.bind(this)
    }
    //Create a new job => /api/v1/job/new
    newJob = catchAsyncErrors(async (req, res, next) => {

        //Adding user's id to body
        req.body.user = req.user.id;

        req.body.countryCode = req.body.countryCode.toUpperCase();
        
        const job = await Job.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Job Created.',
            data: job
        });
    });

    //Get job by id => /api/v1/job{id}
    getJobById = catchAsyncErrors(async (req, res, next) => {
        const job = await Job.findById(req.params.id);

        if (!job || job.length === 0) {
            return next(new ErrorHandler('Job not found.', 404));
        }

        res.status(200).json({
            success: true,
            data: job
        });
    });

    //Get all Jobs => /api/v1/jobs
    getJobs = catchAsyncErrors(async (req, res, next) => {
        const jobs = await Job.find();
        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    });

    //Search Job by any field => /api/v1/job/search?query_params...
    searchJobs = catchAsyncErrors(async (req, res, next) => {
        let query = {};

        // Filter jobs by matching title
        if (req.query.title) {
            query.title = { $regex: new RegExp(req.query.title, 'i') };
        }
        // Filter jobs by country
        if (req.query.countryCode) {
            query.countryCode = req.query.countryCode.toUpperCase();
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

        if (!jobs || jobs.length === 0) {
            return next(new ErrorHandler('Job not found.', 404));
        }

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    });

    // Update a job => /api/v1/job/{id}
    updateJob = catchAsyncErrors(async (req, res, next) => {
        let job = await Job.findById(req.params.id);

        if (!job || job.length === 0) {
            return next(new ErrorHandler('Job not found.', 404));
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Job is updated.',
            data: job
        });
    });

    //Delete a Job by Id => /api/v1/job/:id
    deleteJob = catchAsyncErrors(async (req, res, next) => {
        let job = await Job.findById(req.params.id);

        if (!job || job.length === 0) {
            return next(new ErrorHandler('Job not found.', 404));
        }

        await Job.findByIdAndDelete(req.params.id);

        return res.status(201).json({
            success: true,
            message: 'Job deleted successfully.'
        });
    });

    //Apply to job using resume => /api/v1/job/:id/apply
    applyJob = catchAsyncErrors( async (req, res, next) => {
        let job = await Job.findById(req.params.id).select('+applicantsApplied');

        if(!job) return next(new ErrorHandler('Job not found.', 404));

        //Check if last date of applying to job has passed
        if(job.lastDate < new Date(Date.now()))
        return next(new ErrorHandler('You cannot apply to this job. Date is over.', 400));

        //Check if the user has already applied to this job
        for(const applicants of job.applicantsApplied) {
            if(applicants.id == req.user.id)
            return next(new ErrorHandler('You have already applied for this job.', 400));
        }

        //Check uploaded files
        if(!req.files) return next(new ErrorHandler('Please upload file.', 400));

        const file = req.files.file;

        //Check file type
        const supportedFiles = /.docx|.pdf/; //regex
        if(!supportedFiles.test(path.extname(file.name)))
        return next(new ErrorHandler('Please upload document file.', 400));

        //Check file size
        if(file.size > process.env.MAX_FILE_SIZE)
        return next(new ErrorHandler('Please upload file less than 2MB.', 400));

        //Rename the uploaded resume
        file.name =  `${req.user.name.replace(' ', '_')}_${job._id}${path.parse(file.name).ext}`;

        //Store the file in upload path
        file.mv(`${process.env.UPLOAD_PATH}/${file.name}`, async err => {
            if(err) {
                console.log(err);
                return next(new ErrorHandler('Resume upload failed.', 500));
            }

            await Job.findByIdAndUpdate(req.params.id, {$push: {
                applicantsApplied: {
                    id: req.user.id,
                    resume: file.name
                }
            }}, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            });

            res.status(200).json({
                success: true,
                message: 'Applied to Job successfully.',
                data: file.name
            })
        });
    });
}

module.exports = new JobsController()

