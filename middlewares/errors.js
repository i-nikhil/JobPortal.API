const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    //In development, developer needs to see the complete error stack to trouble shoot the problem
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            errMessage: err.message,
            stack: err.stack
        });
    }

    //In production, returning simplified error message to the client
    if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        error.message = err.message;

        // Wrong Mongoose Object ID Error
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new ErrorHandler(message, 404);
        }

        // Handling Mongoose Validation Error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        }

        // Handle mongoose duplicate key error
        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
            error = new ErrorHandler(message, 400);
        }

        // Handling Wrong JWT token error
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web token is invalid. Try Again!';
            error = new ErrorHandler(message, 500);
        }

        // Handling Expired JWT token error
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web token is expired. Try Again!';
            error = new ErrorHandler(message, 500);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error.'
        })
    }
}