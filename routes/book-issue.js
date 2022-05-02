'use strict';

const express = require('express');
const {
  createBookIssue,
  getBookIssuedList,
  getReturnedBookList,
  getDueBookList,
  returnBook,
  renewalBook,
  getStudentIssuedBook,
  getStudentReturnedBook,
  getStudentDashboardDetails,
} = require('../controllers/book-issue');
const { checkToken, checkRole } = require('../services/auth');

const router = express.Router();

router.route('/').post(
  // checkToken, checkRole('admin'),
  createBookIssue
);

router
  .route('/student')
  .get(checkToken, checkRole('student'), getStudentDashboardDetails);
router
  .route('/student/return-book-list')
  .get(checkToken, checkRole('student'), getStudentReturnedBook);
router
  .route('/student/issue-book-list')
  .get(checkToken, checkRole('student'), getStudentIssuedBook);
router
  .route('/issued-book-list')
  .get(checkToken, checkRole('admin'), getBookIssuedList);
router
  .route('/returned-book-list')
  .get(checkToken, checkRole('admin'), getReturnedBookList);
router
  .route('/due-book-list')
  .get(checkToken, checkRole('admin'), getDueBookList);
router.route('/return-book/:id').post(
  // checkToken, checkRole('admin'),
  returnBook
);
router
  .route('/renewal-book/:id')
  .post(checkToken, checkRole('admin'), renewalBook);

module.exports = router;
