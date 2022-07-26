const express = require('express');

const viewController = require('../controller/viewController');

const router = express.Router();

router.get('/', viewController.getDashboard);
router.get('/add-book', viewController.getAddBook);
router.get('/list-book', viewController.getBooks);
router.get('/profile', viewController.getProfile);

module.exports = router;
