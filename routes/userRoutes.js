// Imports

// 3rd party modules
const express = require('express');

// Node modules or user-defined modules
const authController = require('../controller/authController');
const userController = require('../controller/userController');

// Setting up router for routes

const router = express.Router();

// Routes

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post(
  '/signup',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  authController.signup
);
router.post('/forgot', authController.forgotPassword);
router.patch('/reset/:token', authController.resetPassword);

// The routes after this require to be protected so we use authController.protect

router.use(authController.protect);

router.patch('/update', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

// The routes after this is used by admin to manage the users

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// Exports

module.exports = router;
