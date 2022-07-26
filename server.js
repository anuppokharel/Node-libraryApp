// Setting .env path

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// Imports

const mongoose = require('mongoose');
const app = require('./app');

// Connection our database with our app

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
  }) // It returns apromise so we use then
  .then(() => console.log('DB connection successful!'));

// Initializing our server

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
