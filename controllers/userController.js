const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Job = require("../models/jobs");
const User = require("../models/users");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const fs = require('fs')

class UserController {
    constructor() {
        this.getUserProfile = this.getUserProfile.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
        this.updateUser = this.updateUser.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.#deleteUserData = this.#deleteUserData.bind(this)
    }

    //Get current user profile => api/v1/me
    getUserProfile = catchAsyncErrors(async (req, res, next) => {
        if (!req.user) return next(new ErrorHandler('User not found', 404));

        const user = await User.findById(req.user.id).populate({
            path: 'jobsPublished',
            select: 'title postingDate'
        });
        res.status(200).json({
            success: true,
            data: user
        });
    })

    //Update current user Password => /api/v1/password/update
    updatePassword = catchAsyncErrors(async (req, res, next) => {
        if (!req.user) return next(new ErrorHandler('User not found', 404));

        //Get current user
        const user = await User.findById(req.user.id).select('+password');

        //Check previous password
        const isMatched = await user.comparePassword(req.body.currentPassword);
        if (!isMatched) return next(new ErrorHandler('Old password is incorrect.', 401));

        //Check if new password is same as old
        const isSameAsOld = await user.comparePassword(req.body.newPassword);
        if (isSameAsOld) return next(new ErrorHandler('New password should be different from old password.', 400));

        user.password = req.body.newPassword;
        await user.save();
        sendToken(user, 200, res);
    })

    //Update current user data => /api/v1/me/update
    updateUser = catchAsyncErrors(async (req, res, next) => {
        if (!req.user) return next(new ErrorHandler('User not found', 404));

        const newUserData = {
            name: req.body.name,
            email: req.body.email
        }

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(201).json({
            success: true,
            data: user
        })
    })

    //Delete current user => /api/v1/me/delete
    deleteUser = catchAsyncErrors(async (req, res, next) => {
        if (!req.user) return next(new ErrorHandler('User not found', 404));

        await this.#deleteUserData(req.user.id, req.user.role);

        await User.findByIdAndDelete(req.user.id);

        res.cookie('token', 'none', {
            expires: new Date(Date.now()),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'Your account has been deleted.'
        })
    })

    //Helper method to delete user data
    #deleteUserData = catchAsyncErrors(async (user, role) => {
        if (role === 'employer') {
            await Job.deleteMany({ user: user });
        }

        if (role === 'user') {
            const appliedJobs = await Job.find({ 'applicantsApplied.id': user }).select('+applicantsApplied');

            for (let element of appliedJobs) {
                //Get the object having id and resume
                let obj = element.applicantsApplied.find(o => o.id === user);

                let filepath = `${__dirname}/public/uploads/${obj.resume}`.replace('\\controllers', '');

                fs.unlink(filepath, err => {
                    if (err) return console.log(err.stack);
                });

                element.applicantsApplied.splice(element.applicantsApplied.indexOf(obj.id));

                await element.save();
            }
        }
    })
}

module.exports = new UserController();