// Imports

const morgan = require('morgan');
const express = require('express');
const path = require('path');
const viewRouter = require('./routes/viewRoutes');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');

/* Express is a function upon calling will add bunch of
methods to our app variable */

const app = express();

// Middlewares

if (process.env.NODE_ENV === 'development') app.use(morgan('dev')); // GET /book/ 200 88.279 ms - 731
console.log(process.env.NODE_ENV); // If this doesnt works "npm install -g win-node-env"
app.use(express.json()); // Parses incoming data and puts it onto req

// Custom Middleware

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

// Pug

app.set('view engine', 'pug'); // Telling express that our templete engine is pug
app.set('views', path.join(__dirname, 'view')); // Setting our view folder and path.join concatinates

// Serving static files

app.use(express.static(path.join(__dirname, 'public')));

// Routes
// Middleware

app.use('/', viewRouter); // Mounting route
app.use('/book', bookRouter);
app.use('/user', userRouter);

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
