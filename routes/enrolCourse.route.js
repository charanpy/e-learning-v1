const express = require('express');
const {
  getCourseEnrolRequest,
  requestCourseEnrol,
  acceptUserEnrollment,
  getUserEnrolledCourse,
  getEnrolCourseById,
} = require('../controllers/enrol-course');
const { checkToken, checkRole } = require('../services/auth');

const router = express.Router();

router
  .route('/')
  .get(getCourseEnrolRequest)
  .post(checkToken, checkRole('student'), requestCourseEnrol);

router.route('/my-course').get(checkToken, getUserEnrolledCourse);
router.route('/accept').post(acceptUserEnrollment);
router.route('/:id').get(checkToken, getEnrolCourseById);

module.exports = router;
