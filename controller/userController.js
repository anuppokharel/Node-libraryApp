// Imports

// User-defined modules
const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');

// Functions

const filterObj = (obj, ...allowedFields) => {
  // ...allowedFields select all the fields excluding the first object
  const newObj = {}; // Defining a new object

  /* Selecting the keys of object that we recieve and comparing if allowed key field includes those key field
  and if it includes then adding those key value pair in new object */
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// CRUD Operations

exports.getAllUser = factory.readAll(User);
exports.getUser = factory.readOne(User);
exports.updateUser = factory.updateOne(User); // We cant use this to update password since it uses findIdAndUpdate which doesnt runs our security middleware
exports.deleteUser = factory.deleteOne(User);

// Extra (UpdateMe and DeleteMe)

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id; // Doing this cause there is already id in protect middleware and faking so that the getUser route uses this id

  next();
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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
