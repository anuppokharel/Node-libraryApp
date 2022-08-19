// Imports

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty'],
    minlength: [5, 'A review must have atleast 5 characters in minimum.'],
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be above 5.0'],
  },
  addedAt: {
    type: Date,
    default: Date.now(),
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book', // Referencing the model
    required: [true, 'Review must belong to a book'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
});

reviewSchema.index({ book: 1, user: 1 }, { unique: true }); // This lets only 1 user to post only 1 review in a book

// Query middleware

// Populate fields in schema
reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'book',
  //     select: 'title',
  //   }).populate({
  //     path: 'user',
  //     select: 'name',
  //   });

  this.populate({
    path: 'user',
    select: 'name',
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
