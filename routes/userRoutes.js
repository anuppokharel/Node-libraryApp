// Imports

// 3rd party modules
const express = require('express');

// Node modules or user-defined modules
const userController = require('../controller/userController');
const authController = require('../controller/authController');

// Setting up router for routes

const router = express.Router();

// Routes

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/forgot', authController.forgotPassword);
router.patch('/reset/:token', authController.resetPassword);
router.patch('/update', authController.protect, authController.updatePassword);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// Exports

module.exports = router;
