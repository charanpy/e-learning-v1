const express = require("express");
const {
  createBook,
  getBooks,
  updateBook,
  getBookByCode,
  getBookById,
  deleteBook,
  getBooksCategory,
} = require("../controllers/book");
const { upload } = require("../lib/multer");

const router = express.Router();

router.route("/").get(getBooks).post(upload().single("image"), createBook);
router.route("/category").get(getBooksCategory);
router.route("/access-code").post(getBookByCode);
router
  .route("/:id")
  .put(upload().single("image"), updateBook)
  .delete(deleteBook)
  .get(getBookById);
module.exports = router;
