// Imports

const multer = require('multer'); // Middleware for multipart/form-data
const sharp = require('sharp'); // Easy to use image processing library for nodejs

// User-defined modules
const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');

// Image will be stored as a buffer

const multerStorage = multer.memoryStorage();

// Image will be stored in disk

// const multerStorage = multer.diskStorage({
//   destination: (req, file, callbackFunction) => {
//     callbackFunction(null, 'public/img/users');
//   },
//   filename: (req, file, callbackFunction) => {
//     // user-7192089adf-35212312.jpg(user-userid-timestamp)
//     const ext = file.mimetype.split('/')[1];
//     callbackFunction(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerFilter = (req, file, callbackFunction) => {
  if (file.mimetype.startsWith('image')) {
    callbackFunction(null, true);
  } else {
    callbackFunction(
      new AppError('Not an image! Please upload only images', 400),
      false
    ); // 400 bad request
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter }); // If we add dest options it stores it into the desired destination, if we dont add option then it stores in memory temporarily

exports.uploadUserPhoto = upload.single('image'); //.single cause we want to upload only 1 single image. 'image' means the field which holds the image

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.body.name}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

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
  const filteredBody = filterObj(req.body, 'name', 'email', 'bio');
  if (req.file) filteredBody.image = req.file.filename;

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
