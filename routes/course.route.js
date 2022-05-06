const express = require('express');
const {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  createCheckoutSession,
} = require('../controllers/course');
const { upload } = require('../lib/multer');
const { checkToken, checkRole } = require('../services/auth');

const router = express.Router();

router.route('/').get(getCourse).post(upload().single('image'), createCourse);
router
  .route('/checkout')
  .post(checkToken, checkRole('member'), createCheckoutSession);
router
  .route('/:id')
  .put(upload().single('image'), updateCourse)
  .delete(deleteCourse)
  .get(getCourseById);
module.exports = router;
