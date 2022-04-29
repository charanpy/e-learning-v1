const express = require('express');
const {
  createStudent,
  getStudent,
  deleteStudent,
  updateStudent,
  getMember,
  dismissStudent,
  login,
  getMe,
} = require('../controllers/student');
const { checkToken, checkRole } = require('../services/auth');

const router = express.Router();

router.route('/').post(createStudent).get(getStudent);
router.route('/me').get(checkToken, checkRole('student'), getMe);
router.route('/login').post(login);
router.route('/member').get(getMember);

router.route('/dismiss-student/:id').delete(dismissStudent);
router.route('/:id').delete(deleteStudent).put(updateStudent);

module.exports = router;
