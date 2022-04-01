const Book = require("../../models/Book.model");
const catchAsync = require("../../lib/catchAsync");

const createBook = catchAsync(async (req, res) => {
  const filters = {
    isDeleted: false,
    accessCode: req.body.accessCode,
  };

  const doc = await Book.findOne(filters);
  if (doc) {
    return res.status(400).json({ Message: "Use Different Access Code" });
  }
  const book = await Book.create(req.body);
  return res.status(201).json("Created");
});
