const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.title;
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401); // Unauthorized

const sendErrorDevelopment = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stact: err.stack,
    });
  }

  // Rendered website
  console.error('Error', err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!. Try again',
    msg: err.message,
  });
};

const handleJWTExpiredError = () =>
  new AppError('Your token has exipred! Please log in again.', 401);

const sendErrorProduction = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Log error
    console.error('ERROR', err);

    // Send generic message to the client
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // Rendered Website
  if (err.isOperational) {
    // Rendered Website
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!. Try again',
      msg: err.message,
    });
  }
  // Log error
  console.error('ERROR', err);

  // Send generic message to the client
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!. Try again',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // 500 - Internal server error
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }; // Does not copy err.message
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProduction(error, req, res);
  }
};
