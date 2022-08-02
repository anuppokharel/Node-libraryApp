const { findOneAndDelete } = require('../model/bookModel');
const Book = require('../model/bookModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Special route operations

exports.aliasCheapBooks = catchAsync(async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-rating';
  req.query.fields = 'title, price, rating';

  next();
});

// CRUD Operations

exports.createBook = catchAsync(async (req, res, next) => {
  const newBook = await Book.create(req.body);
  // const newBook = new Book({})
  // newTour.save()

  res.status(201).json({
    status: 'success',
    data: {
      book: newBook,
    },
  });
});

exports.readAllBook = catchAsync(async (req, res, next) => {
  // Execute query
  const features = new APIFeatures(Book.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const books = await features.query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books,
    },
  });
});

exports.readBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const book = await book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return next(new AppError('No book found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

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
