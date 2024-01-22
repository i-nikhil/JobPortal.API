
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    //In development, developer needs to see the complete error stack to trouble shoot the problem
    if (process.env.NODE_ENV === 'development') {
        console.log('in dev block');
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        });
    }

    console.log(process.env.NODE_ENV);
    debugger;

    //In production, returning simplified error message to the client
    if (process.env.NODE_ENV === 'production') {
        console.log('in dev block');
        res.status(err.statusCode).json({
            success: false,
            errMessage: err.message || 'Internal Server Error'
        });
    }
}