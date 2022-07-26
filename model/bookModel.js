const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A book must have a title'], // Validator
    unique: true,
  },
  author: String,
  summary: {
    type: String,
    trim: true,
  },
  publication: String,
  image: String,
  price: {
    type: Number,
    required: [true, 'A book must have a price'],
  },
  bookpage: Number,
  edition: String,
  isbn: Number,
  rating: {
    type: Number,
    default: 4,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
