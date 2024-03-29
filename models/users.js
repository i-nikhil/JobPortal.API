const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'employer'],
            message: 'Please enter correct role'
        },
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please enter password for your account'],
        minlength: [8, 'Your password must be at least 8 characters long'],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

//Encrypt password before saving
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10)
})

//Return JSON Web Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME })
}

//Compare user password with tha stored password in database
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}
//Show all jobs created by user using virtuals
userSchema.virtual('jobsPublished', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})

module.exports = mongoose.model('User', userSchema)