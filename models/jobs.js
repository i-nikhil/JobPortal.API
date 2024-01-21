const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
const countriesList = require('countries-list');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter a Job title.'],
        trim: true,
        maxlength: [100, 'Job title can not exceed 100 characters.']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please enter Job descrition.'],
        maxlength: [1000, 'Job description can not exceed 1000 characters.'],
        trim: true
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please add a valid email address.']
    },
    address: {
        type: String,
        required: [true, 'Please add an address.'],
        trim: true
    },
    countryCode: {
        type: String,
        required: [true, 'Please enter a valid country.'],
        trim: true,
        validate: {
            validator: function(value) {
                // Check if the city name is valid using the cities package
                return countriesList.countries[value.toUpperCase()] !== undefined;
            },
            message: 'Please enter a valid country name.'
        }
    },
    company: {
        type: String,
        required: [true, 'Please add Company name.']
    },
    industry: {
        type: [String],
        required: true,
        enum: {
            values: [
                'Business',
                'Information Technology',
                'Banking',
                'Education/Training',
                'Telecommunication',
                'Marketing',
                'Advertising',
                'Others'
            ],
            message: 'Please select correct options for industry.'
        }
    },
    jobType: {
        type: String,
        required: true,
        enum: {
            values: [
                'Permanant',
                'Temporary',
                'Internship'
            ],
            message: 'Please select correct options for job type.'
        }
    },
    minEducation: {
        type: String,
        required: true,
        enum: {
            values: [
                'Bachelors',
                'Masters',
                'Phd'
            ],
            message: 'Please select correct options for Education.'
        }
    },
    positions: {
        type: Number,
        default: 1
    },
    experience: {
        type: String,
        required: true,
        enum: {
            values: [
                'No Experience',
                '1 Year - 2 Years',
                '2 Years - 5 Years',
                '5 Years+'
            ],
            message: 'Please select correct options for Experience.'
        }
    },
    salary: {
        type: Number,
        required: [true, 'Please enter expected salary for this job.']
    },
    postingDate: {
        type: Date,
        default: Date.now
    },
    lastDate: {
        type: Date,
        default: new Date().setDate(new Date().getDate() + 7)
    },
    applicantsApplied: {
        type: [Object],
        select: false
    }
});

//Creating Job Slug before saving
//pre - middleware to be called before the object creation
jobSchema.pre('save',function(next){
    //Creating slug before saving to DB
    this.slug = slugify(this.title, {lower: true});
    next();
})


module.exports = mongoose.model('Job', jobSchema);