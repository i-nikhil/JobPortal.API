const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/users');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken')

class AuthController {
    constructor() {
        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    // Register a new user => /api/v1/register
    registerUser = catchAsyncErrors(async (req, res, next) => {
        const {name, email, password, role} = req.body;
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        sendToken(user, 200, res)
    })

    //Login user => /api/v1/login
    loginUser = catchAsyncErrors(async (req, res, next) => {
        const {email, password} = req.body

        //Check if email and password entered by user
        if(!email || !password)
        return next(new ErrorHandler('Please enter the missing email or password.'), 400)

        //Finding user in database
        const user = await User.findOne({email}).select('+password')
        if(!user) return next(new ErrorHandler('Invalid Email or Password.', 401))

        //Check if password is correct
        const isPasswordMatched = await user.comparePassword(password)
        if(!isPasswordMatched) return next(new ErrorHandler('Invalid Email or Password.', 401))

        sendToken(user, 200, res)
    })
}

module.exports = new AuthController()