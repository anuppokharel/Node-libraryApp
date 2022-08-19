/* Fat model thin controller */

// Imports

// 3rd party modules
const mongoose = require('mongoose'); // Framework to model your application data
const slugify = require('slugify'); // Creates a slug for your string
const validator = require('validator'); // Validates and Sanitizes the string

const User = require('./userModel');

// Create a new schema

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
    moderators: [
      // we do this when we are using referencing or normalization, if it was embedding we simply moderators: Array
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // This is how we establish references, you don't need to import userModel for this
      },
    ],
  },
  // Object for schema options
  {
    toJSON: { virtuals: true }, // Virtuals to be part of output
    toObject: { virtuals: true },
  }
);

/* Index are basically an ordered list of information that are stored 
somewhere outside of the collection. Whether to use or not depends totally on how 
much the query is searched. If searched more then it is worth the storage it takes,
if not then we don't need to index any field. Since its cost of maintaining the index.
Without an index mongo has to look every document 1 by 1 which is not good for
performance but with index it only looks at the list it created. Basically index is 
for the performace efficiency

call explain() after query to see the, imp facts to check executionStats, nReturned, totalDocsExamined
*/

// bookSchema.index({ price: 1 }); // Acending
bookSchema.index({ price: 1, rating: -1 }); // Compound index
bookSchema.index({ slug: 1 });

/* Virtual property is used when we need to convert
something to another(for eg: pound to kg) we dont need
to save multiple data with pound and kg instead we can
convert them and display that to out user without saving
them for memory save and stuff */

// bookSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

// Virtual populate
bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book', // This field is where the information is stored in the other reviewModel
  localField: '_id', // This field is where the information is stored here in the bookModel
});

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

// Embedding
// bookSchema.pre('save', async function (next) {
//   const moderatorsPromises = this.moderators.map(
//     // this.moderators has an array of id
//     async (id) => await User.findById(id)
//   );
//   this.moderators = await Promise.all(moderatorsPromises);
//   // overwriting the id with the data we get from query
//   // since it lies in the document it is called embedding

//   next();
//   /* We are not using embedding because suppose user wants to update email,
//   his role. then he has to go to book document just to update that so it is not practical so we use referencing */
// });

// Query middleware

bookSchema.pre('find', function (next) {
  // /^find/ -> All the strings that start with find
  this.find({ secretBook: { $ne: true } });
  this.start = Date.now();

  next();
});

bookSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'moderators',
    select: '-__v -passwordChangedAt',
  });

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

// Creating a model out of Schema

const Book = mongoose.model('Book', bookSchema);

// Exports

module.exports = Book;
