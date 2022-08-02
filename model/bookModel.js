const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A book must have a title'], // Build-in data Validator
      unique: true,
      trim: true,
      maxlength: [
        50,
        'A book title must have less or equal then 50 characters',
      ],
      minlength: [
        3,
        'A book title must have greater or equal then 3 characters',
      ],
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
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; // this only points to current document on new document creation
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    slug: String,
    bookpage: Number,
    edition: String,
    isbn: Number,
    rating: {
      type: Number,
      default: 4,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    addedAt: {
      type: Date,
      default: Date.now(),
      select: false, // It hides this field
    },
    secretBook: {
      type: Boolean,
      default: false,
    },
  }
  // Object for schema options
  // {
  //   toJSON: { virtuals: true }, // Virtuals to be part of output
  //   toObject: { virtuals: true },
  // }
);

/* Virtual property is used when we need to convert
something to another(for eg: pound to kg) we dont need
to save multiple data with pound and kg instead we can
convert them and display that to out user without saving
them for memory save and stuff */
// bookSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

// Document middleware
// This pre runs before .save() and .create(), doesnt applies for insert(), find()
bookSchema.pre('save', function (next) {
  // 'save' is called hooks. It is called pre save hook or pre save middleware
  this.slug = slugify(this.title, { lower: true });

  next();
});

// This pre runs after all the pre middleware functions are completed
bookSchema.post('save', function (doc, next) {
  console.log(doc);

  next();
});

// Query middleware
bookSchema.pre('find', function (next) {
  // /^find/ -> All the strings that start with find
  this.find({ secretBook: { $ne: true } });
  this.start = Date.now();

  next();
});

bookSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`);

  next();
});

// Aggregation middleware

bookSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretBook: { $ne: true } } });
  /* unshift() to add at the beginning of the array and shift() to add at the end of the array
  console.log(this.pipeline()); */

  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;

/* Fat model thin controller */
