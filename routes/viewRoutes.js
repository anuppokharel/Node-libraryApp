const express = require('express');

const viewController = require('../controller/viewController');
const authController = require('../controller/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getDashboard);
router.get('/add-book', viewController.getAddBook);
router.get('/list-book', viewController.getBooks);
router.get('/profile', viewController.getProfile);
router.get('/viewbook/:slug', viewController.getBook);
router.get('/login', viewController.login);

module.exports = router;
