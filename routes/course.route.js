const express = require('express');
const {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
} = require('../controllers/course');
const { upload } = require('../lib/multer');

const router = express.Router();

router.route('/').get(getCourse).post(upload().single('image'), createCourse);
router
  .route('/:id')
  .put(upload().single('image'), updateCourse)
  .delete(deleteCourse)
  .get(getCourseById);
module.exports = router;
