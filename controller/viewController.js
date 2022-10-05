const pagination = require('./utilities/functionFactory');

const Book = require('../model/bookModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// exports.getDashboard = (req, res, next) => {
//   // next is used to make catchAsync
//   // 1. Get tour data from collection
//   const books = await Book.find();
//   // 2. Build template
//   // 3. Render that template using book data from 1
//   res.status(200).render('dashboard', {
//     title: 'Dashboard',
//     books,
//   });
// };

exports.getDashboard = (req, res, next) => {
  let totalDocuments;
  const page = +req.query.page || 1; // Get page number either from query or default to 1

  const doc_per_page = 4; // Document per page || Books per page || Products per page

  Book.find()
    .countDocuments() // Counts the total number of document in a collection
    .then((numDocument) => {
      totalDocuments = numDocument;

      return Book.find()
        .skip((page - 1) * doc_per_page) // Suppose u have 5 document, if u r in page one 1-1=0 and 0*5=0 so we skip 0 doc
        .limit(doc_per_page); // Limits, limit the number of document you want to show in page
    })
    .then((documents) => {
      res.status(200).render('dashboard', {
        path: '/',
        title: 'Dashboard',
        books: documents,
        currentPage: page,
        hasNextPage: doc_per_page * page < totalDocuments,
        /* Suppose document per page is 5 and current page is 2 and total document is 11 then in 2 page we saw 2*5=10 document
          still 1 document remains so it returns true and hence hasNextPage exists */
        hasPreviousPage: page > 1,
        // 1 is the starting page if page is 2 it means it is less then page 1 so it returns true and hence hasPreviousPage exists
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalDocuments / doc_per_page), // 11/5=2.2 => 3, -5.9 => 5. It rounds a number UP to the nearest integer
      });
    })
    .catch((error) => next(new AppError(error, 404)));
};

// exports.getDashboard = pagination.paginate(Book, {
//   viewPath: 'dashboard',
//   path: '/',
//   title: 'Dashboard',
// });

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
