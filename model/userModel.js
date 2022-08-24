// Imports

// 3rd party modules
const crypto = require('crypto'); // JS library of crypto standards
const mongoose = require('mongoose'); // mongoose provides a straight-forward, schema-based solution to model application data
const bcrypt = require('bcryptjs'); // Library to help hash passwords
const validator = require('validator'); // Library to validate and sanitize string

// Defining schema for user collection

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  image: { type: String, default: 'default.jpg' },
  bio: { type: String, default: 'Hi, There!' },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password!'],
    minlength: 7,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function (el) {
        // This only works on CREATE & SAVE
        return el === this.password; // If the password matches it returns true, if it doesnt it returns false
      },
      message: 'Please provide a matching password!',
    },
  },
  passwordChangedAt: { type: Date, select: false },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Hashing the password

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the confirmPassword field
  this.confirmPassword = undefined;
  next();
});

// Document middleware

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Query middleware

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });

  next();
});

// Instance method

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // this.password not available since select: false
  return await bcrypt.compare(candidatePassword, userPassword);
};

// userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimeStamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );
//     // getTime converts into milisecond, parseInt parses into number
//     return JWTTimestamp < changedTimeStamp;
//   }

//   // False means not changed
//   return false;
// };

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Creating a model out of schema

const User = mongoose.model('User', userSchema);

// Exports

module.exports = User;
