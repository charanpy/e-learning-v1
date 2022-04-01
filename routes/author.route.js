const express = require('express');
const {
  createAuthor,
  getAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/author');

const router = express.Router();

router.route('/').get(getAuthor).post(createAuthor);
router.route('/:id').get(getAuthorById).put(updateAuthor).delete(deleteAuthor);

module.exports = router;
