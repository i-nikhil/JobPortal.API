const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const jobs = require('./routes/jobs');
const auth = require('./routes/auth');
const user = require('./routes/user')
const middleware = require('./middlewares/errors');
const ErrorHandler = require('./utils/errorHandler');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

//Setting up config.env file variables
dotenv.config({ path: './config/config.env' });

// Handling Uncaught Exception
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down due to uncaught exception.')
    process.exit(1);
});

//Connecting to database
connectDatabase();

//Setup security headers
app.use(helmet());

//Setup body parser
app.use(express.json());

//Set coookie parser
app.unsubscribe(cookieParser());

//Handle file upload
app.use(fileUpload());

//Sanitize user supplied data to prevent mongoDB operator injection
app.use(mongoSanitize());

//Prevent XSS attacks using scripts in input
app.use(xssClean());

//Prevent parameter pollution
app.use(hpp());

//Setup CORS - Accessible by other domains
app.use(cors());

//Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 minutes
    max: 100 //100 request per 10 minutes
});

app.use(limiter);

//Setup all routes
app.use('/api/v1', jobs);
app.use('/api/v1', auth);
app.use('/api/v1', user);

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