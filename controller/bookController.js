// Imports

// User-defined modules
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Book = require('../model/bookModel');
const { findOneAndDelete } = require('../model/bookModel');
const factory = require('./handlerFactory');

// Special route operations

exports.aliasCheapBooks = catchAsync(async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-rating';
  req.query.fields = 'title, price, rating';

  next();
});

// CRUD Operations

exports.createBook = factory.createOne(Book);
exports.readAllBook = factory.readAll(Book);
exports.readBook = factory.readOne(Book, { path: 'reviews' });
exports.updateBook = factory.updateOne(Book);
exports.deleteBook = factory.deleteOne(Book);

// Extra

exports.getBookStats = catchAsync(async (req, res, next) => {
  const stats = await Book.aggregate([
    {
      $match: { rating: { $gte: 1 } },
    },
    {
      $group: {
        // _id: '$publication', // $ratings, $author
        _id: { $toUpper: '$publication' },
        numBooks: { $sum: 1 },
        numRating: { $sum: '$rating' },
        avgRating: { $avg: '$rating' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // 1 is ascending
    },
    // {
    //   $match: { _id: { $ne: 'OLYMPIA PRESS' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
