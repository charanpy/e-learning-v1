const express = require('express');
const {
  setMarkStatus,
  getCompletedCourseLesson,
} = require('../controllers/completed-course-lesson');
const { checkToken } = require('../services/auth');

const router = express.Router();

router.route('/').post(checkToken, setMarkStatus);
router.route('/:courseId').get(checkToken, getCompletedCourseLesson);

module.exports = router;
