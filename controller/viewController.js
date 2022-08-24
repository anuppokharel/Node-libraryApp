const Book = require('../model/bookModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getDashboard = async (req, res, next) => {
  // next is used to make catchAsync
  // 1. Get tour data from collection

  const books = await Book.find();

  // 2. Build template

  // 3. Render that template using book data from 1

  res.status(200).render('dashboard', {
    title: 'Dashboard',
    books,
  });
};

exports.getAddBook = (req, res) => {
  res.status(200).render('addBook', {
    title: 'Add Book',
  });
};

exports.getBooks = async (req, res, next) => {
  // 1. Get data for the requested book
  const books = await Book.find();

  // 2. Build template

  // 3. Render template using data from step 1

  res.status(200).render('listBooks', {
    title: 'List Books',
    books,
  });
};

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!book) {
    return next(new AppError('There is no book with that name', 404)); // 404 not found
  }

  res.status(200).render('book', {
    book,
  });
});

exports.getRegister = (req, res) => {
  res.status(200).render('register', {
    title: 'Register',
  });
};

exports.getProfile = (req, res) => {
  res.status(200).render('profile', {
    title: 'Profile',
  });
};

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
