// Imports

// User-defined modules
const Review = require('../model/reviewModel');
const factory = require('./handlerFactory');

/* Set the bookId and userId from params and protect user information
for create review if it isnt available in request.body */

exports.setBookUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.book) req.body.book = req.params.bookId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// CRUD Operations

exports.createReview = factory.createOne(Review); // Create
exports.readAllReview = factory.readAll(Review); // Read
exports.readReview = factory.readOne(Review);
exports.updateReview = factory.updateOne(Review); // Update
exports.deleteReview = factory.deleteOne(Review); // Delete
