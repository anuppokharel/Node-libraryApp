const express = require('express');

const bookController = require('../controller/bookController');

const router = express.Router();

router
  .route('/')
  .get(bookController.readAllBook)
  .post(bookController.createBook);

router
  .route('/:id')
  .get(bookController.readBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
