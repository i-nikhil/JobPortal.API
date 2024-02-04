const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/users");


class UserController {
    constructor() {
        this.getUserProfile = this.getUserProfile.bind(this)
    }

    //Get current user profile => api/v1/me
    getUserProfile = catchAsyncErrors( async (req, res, next) => {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    })
}

module.exports = new UserController();