// Imports

// 3rd party modules
const express = require('express'); // Web framework for node
const rateLimit = require('express-rate-limit'); // Limits the rate of request from same IP
const mongoSanitize = require('express-mongo-sanitize'); // Sanitizes the NoSQL injection by removing $ from the fields
const morgan = require('morgan'); // HTTP request logger middleware for node
const helmet = require('helmet'); // Helps to secure Express by setting various HTTP headers
const xss = require('xss-clean'); // Converts HTML tag to prevent malicious activity from both HTML or JS
const hpp = require('hpp'); // HTTP parameter polution

// Node modules & user-defined modules
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const viewRouter = require('./routes/viewRoutes');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');

/* Express is a function upon calling will add bunch of
methods to our app variable */

const app = express();

// Global Middlewares

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev')); // GET /book/ 200 88.279 ms - 731
console.log(process.env.NODE_ENV); // If this doesnt works "npm install -g win-node-env"

// Limit requests from same IP

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  // 100 requests in 1 hour from same IP
  message:
    'Too many requests from this IP Address, please try again in an hour!',
});

app.use('/book', limiter);

// Pug

app.set('view engine', 'pug'); // Telling express that our view(MVC) templete engine is pug

// Body parser, reading data from body into req.body

app.use(
  express.json({ limit: '15kb' })
); /* Parses incoming data and puts it onto req,
setting limit 15kb to prevent injection of malicious code */

// Data sanitization against NoSQL query injection

app.use(mongoSanitize());

// Data sanitization against XSS

app.use(xss()); // Blocks HTML code

// Prevent parameter pollution

app.use(
  hpp({
    whitelist: ['bookpage', 'price'], // User can search multiple data if its in whitelist else user can't and only last data is searched
  })
);

// Serving static files

app.set('views', path.join(__dirname, 'view')); // Setting our view folder and path.join concatinates

// Serving static files

app.use(express.static(path.join(__dirname, 'public')));

// Custom Middleware

app.use((req, res, next) => {
  console.log('Hello from the middleware.');

  next();
});

// Routes
// Middleware

app.use('/', viewRouter); // Mounting route
app.use('/book', bookRouter);
app.use('/user', userRouter);

// Undefined route handler
app.all('*', (req, res, next) => {
  // all() means get, post, patch, delete, etc

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)); // It runs right after the routes
});

app.use(globalErrorHandler);

// Exports

module.exports = app;

// For API

// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "Hello from the server side!",
//     app: "Library Management System",
//   });
// });

// app.post("/", (req, res) => {
//   res.send("You can also post in this!");
// });
