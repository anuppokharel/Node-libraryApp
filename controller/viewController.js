const Book = require('../model/bookModel');

exports.getDashboard = (req, res) => {
  res.status(200).render('dashboard', {
    title: 'Dashboard',
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

exports.getProfile = (req, res) => {
  res.status(200).render('profile', {
    title: 'Profilfe',
  });
};
