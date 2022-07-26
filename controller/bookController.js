const { findOneAndDelete } = require('../model/bookModel');
const Book = require('../model/bookModel');

// CRUD Operations

exports.createBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    // const newBook = new Book({})
    // newTour.save()

    res.status(201).json({
      status: 'success',
      data: {
        book: newBook,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.readAllBook = async (req, res) => {
  try {
    // Build query
    // 1. Filtering our API
    const queryObj = { ...req.query };
    /* ...creates hard copy of the object we want,
    req.query is all the parameters we passed in our url like ?price=512&page=111 */
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2. Advance filtering by including gte, lte, etc
    let queryStr = JSON.stringify(queryObj); // Converts object to string
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    /* \b \b will only select lt or lte not lte or ltee just the given word lt,
    g at the end will basically replace all the field because without it it
    would only do the first one and would ignore others */

    // Passing the filtered object
    const query = Book.find(JSON.parse(queryStr)); // Parses string to object

    // Execute query
    const books = await query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: books.length,
      data: {
        books,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.readBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        book,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
