// Setting .env path

// config will read .env file, parse the contents, assign it to process.env
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// Handling unhandled exception

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Imports

const mongoose = require('mongoose'); // mongoose provides a straight-forward, schema-based solution to model your application data.
const app = require('./app'); // app = express();

// Connection of database with our app

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true, // Removes depriciation msg
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }) // It returns a promise so we use then
  .then(() => console.log('DB connection successful!'));

// Initializing our server

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Handling unhandled rejection

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection! Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
