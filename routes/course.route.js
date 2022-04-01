const express = require('express');
const {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course');
const { upload } = require('../lib/multer');

const router = express.Router();

router.route('/').get(getCourse).post(upload().single('image'), createCourse);

router
  .route('/:id')
  .patch(upload().single('image'), updateCourse)
  .delete(deleteCourse);

module.exports = router;
