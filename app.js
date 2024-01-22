const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const jobs = require('./routes/jobs');
const middleware = require('./middlewares/errors');
const ErrorHandler = require('./utils/errorHandler');

//Setting up config.env file variables
dotenv.config({path: './config/config.env'}); 

// Handling Uncaught Exception
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down due to uncaught exception.')
    process.exit(1);
});

//Connecting to database
connectDatabase();

//Setup body parser
app.use(express.json());

//Setup all routes
app.use('/api/v1', jobs);

// Handle unhandled routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

//Middleware to handle errors
app.use(middleware);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});

//Handling unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1);
    });
});