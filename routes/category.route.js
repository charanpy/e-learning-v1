const express = require('express');
const {
  getCategory,
  createCategory,
  deleteCategory,
} = require('../controllers/category');

const router = express.Router();

router.route('/').get(getCategory).post(createCategory);

router.route('/:id').delete(deleteCategory);

module.exports = router;
