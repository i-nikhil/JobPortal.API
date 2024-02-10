# JobPortal.API

JobPortal.API is a Node.js-based project leveraging the Express.js framework, is designed to provide a seamless and efficient API for online job portals. It facilitates the posting, updating, and deletion of job vacancies by employer, while offering job seekers search functionalities, resume-based applications, and real-time tracking of applications.

Please find the detailed API documentation and try out links here:
https://documenter.getpostman.com/view/2s9YyzdyBV

Let's dive into the features and functionalities:

## Functionality:
- Utilized Nodemon module for running the project in both production and non-production environments.
- Employed MongoDB as the NoSQL database, harnessing its capabilities.
- Utilized Mongoose module for handling model validations.
- Implemented password encryption using bcryptjs during user registration and storage in the database.
- Implemented JWT token-based authentication and stored tokens in cookies.
- Managed resume file uploads using the express-fileupload module.
- Implemented rate limiting for API calls, set at 100 requests per 10 minutes using the express-rate-limit module.
- Implemented HTTP security headers using the helmet module.
- Ensured data integrity and security using express-mongo-sanitize, xss-clean, and hpp modules.
- Hosted API documentation page using Postman documenter.

## Features:
1. New candidates can register as either job-seekers or employers.
2. Employers can post new jobs, edit and delete jobs created by them, and see the jobs applied to by candidates.
3. When a job is deleted, all its related applied resumes are cleared from memory.
4. Job-seekers can filter/search jobs by title, country, industry, job type, minimum required education, experience, and salary.
5. Job-seekers can apply to jobs using the resume upload functionality.
6. Job-seekers cannot apply after the last date to apply for a job vacancy.
7. Login/logout endpoints enable the setup and removal of tokens into cookies.
8. The Admin role has access to delete employers, users, or job posts along with their related files from memory.
