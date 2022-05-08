const express = require('express');
const {
  createMaterial,
  deleteMaterial,
  getMaterial,
  getMaterialByYear,
} = require('../controllers/lib-material');
const { upload } = require('../lib/multer');
const { checkToken, checkRole } = require('../services/auth');

const router = express.Router();

router
  .route('/')
  .get(
    // checkToken, checkRole('admin'),
    getMaterial
  )
  .post(
    // checkToken,
    // checkRole('admin'),
    upload('file').single('file'),
    createMaterial
  );

router
  .route('/student')
  .get(checkToken, checkRole('student'), getMaterialByYear);
router.route('/:id').delete(checkToken, checkRole('admin'), deleteMaterial);

module.exports = router;
