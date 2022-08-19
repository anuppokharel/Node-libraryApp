// Imports

// 3rd party modules
const express = require('express'); // Web framework for node

// User-defined modules
const bookController = require('../controller/bookController');
const authController = require('../controller/authController');
const reviewRouter = require('./reviewRoutes');

// Setting up router for routes

const router = express.Router();

router.use('/:bookId/review', reviewRouter); // Mounting a router, if we want to find reviews of single book then this will be used

// Special routes

router
  .route('/top-5-cheap')
  .get(bookController.aliasCheapBooks, bookController.readAllBook);

router.route('/book-stats').get(bookController.getBookStats);

router
  .route('/')
  .get(bookController.readAllBook)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'moderator'),
    bookController.createBook
  );

router
  .route('/:id')
  .get(bookController.readBook)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'moderator'),
    bookController.updateBook
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'moderator'),
    bookController.deleteBook
  );

// Exports

module.exports = router;
