// Import

// 3rd party module
const express = require('express');

// User-defined module
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');

// Setting out router for routes

const router = express.Router({ mergeParams: true });

// Protecting the review routes

router.use(authController.protect);

// Routes

router
  .route('/')
  .get(reviewController.readAllReview)
  .post(
    authController.restrictTo('user'),
    reviewController.setBookUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.readReview)
  .patch(authController.restrictTo('user'), reviewController.updateReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

// Exports

module.exports = router;
