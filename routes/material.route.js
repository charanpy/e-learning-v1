const express = require('express');
const {
  createMaterial,
  getMaterial,
  updateMaterial,
  deleteMaterial,
} = require('../controllers/material');
const { upload } = require('../lib/multer');

const router = express.Router();

router.route('/').post(upload().single('file'), createMaterial);
router
  .route('/:id')
  .get(getMaterial)
  .put(upload().single('file'), updateMaterial)
  .delete(deleteMaterial);

module.exports = router;
