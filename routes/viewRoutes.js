const express = require('express');

const viewController = require('../controller/viewController');
const authController = require('../controller/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getDashboard);
router.get('/add-book', authController.isLoggedIn, viewController.getAddBook);
router.get('/list-book', authController.isLoggedIn, viewController.getBooks);
router.get('/register', viewController.getRegister);
router.get('/profile', authController.protect, viewController.getProfile);
router.get(
  '/viewbook/:slug',
  authController.isLoggedIn,
  viewController.getBook
);
router.get('/login', authController.isLoggedIn, viewController.login);

module.exports = router;
