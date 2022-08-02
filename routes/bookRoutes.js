const express = require('express');

const bookController = require('../controller/bookController');
const authController = require('../controller/authController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(bookController.aliasCheapBooks, bookController.readAllBook);

router.route('/book-stats').get(bookController.getBookStats);

router
  .route('/')
  .get(bookController.readAllBook)
  .post(bookController.createBook);

router
  .route('/:id')
  .get(authController.protect, bookController.readBook)
  .patch(bookController.updateBook)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    bookController.deleteBook
  );

module.exports = router;
