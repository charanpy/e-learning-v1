const express = require('express');
const {
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  updatePassword,
  adminLogin,
} = require('../controllers/admin');
const { checkRole, checkToken } = require('../services/auth');

const router = express.Router();

router.route('/').get(checkToken, checkRole('admin'), getAdmins);
router.route('/').post( createAdmin);
router.route('/login').post(adminLogin);

router.route('/:id').put(checkToken, checkRole('admin'), updateAdmin);
router.route('/:id').delete(checkToken, checkRole('admin'), deleteAdmin);
router.route('/').post(checkToken, checkRole('admin'), updatePassword);

module.exports = router;
