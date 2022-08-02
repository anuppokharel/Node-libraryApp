const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
  });
};

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // Send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user POSTs password data

  if (req.body.password || req.body.confirmPassword)
    return next(
      new AppError(
        'This route is not for password updates. Please user /update',
        400
      )
    ); // Bad request

  // 2. Filtered out unwanted fields name that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3. Updating user document

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
