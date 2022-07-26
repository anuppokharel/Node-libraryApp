// Imports

// 3rd party modules
const crypto = require('crypto'); // JS library of crypto standards
const jwt = require('jsonwebtoken'); // An implementation of JSON Web Tokens
const { promisify } = require('util'); // Wraps node modules,functions,methods written in the Node-callback style to return

// Node modules or user defined modules
const sendEmail = require('../utils/email');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const userController = require('./userController');
const User = require('../model/userModel');
const { find } = require('../model/userModel'); //

// Functions

const signToken = (id) => {
  // Creates a JsonWebToken(JWT)

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents client-side scripts to access/modify the token data
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove

  user.password = undefined;

  res.status(statusCode).json({
    // 201 is created
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// CRUD Operations

exports.signup = catchAsync(async (req, res, next) => {
  const signupFields = {
    name: req.body.name,
    email: req.body.email,
    image: req.body.image,
    bio: req.body.bio,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
  };

  if (req.file) signupFields.image = req.file.filename;

  const newUser = await User.create(signupFields);

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist

  if (!email || !password) {
    return next(new AppError('Please provide your email and password', 400)); // 400 bad request
  }

  // 2. Check if the user exists && password is correct

  const user = await User.findOne({ email }).select('+password'); // + since password is select: false in model

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401)); // 401 - Unauthorized
  }

  // 3. If everything is ok, send token back to client

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: false,
  });

  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get token and check if it's there

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    console.log(req.headers.authorization);
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2. Verify token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exists',
        401
      )
    );
  }

  // 4. Check if user change password after the token was issued

  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please log in again', 401)
  //   );
  // }

  // Grant access to protected route

  res.locals.user = currentUser; // Basically the template gets access to this/ Like passing data using render
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'moderator']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      ); // 403 - Forbidden
    }

    next();
  };
};

// Only for rendered pages, no errors!

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1. Verify token

      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2. Check if user still exists

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3. Check if user change password after the token was issued

      // if (currentUser.changedPasswordAfter(decoded.iat)) {
      //   return next(
      //     new AppError('User recently changed password! Please log in again', 401)
      //   );
      // }

      // There is a logged in user

      res.locals.user = currentUser; // Basically the template gets access to this/ Like passing data using render
      return next();
    } catch (err) {
      return next();
    }
  }

  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on POSTed email

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2. Generate the random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/user/reset/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and confirm password to: ${resetURL}.\nIf you didn't forgot your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 min only)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.createPasswordExipresToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If token has not expired, and there is user, set the new password

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save(); // We need to save since document is just modified

  //

  // 3. Update changedPasswordAt property for the user. Log the user in, send JWT

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from collection

  const user = await User.findById(req.user.id).select('+password');

  // 2. Check if  POSTed current password is correct

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3. If so, update password

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // 4. Log user in, send JWT

  createSendToken(user, 200, res);
});
