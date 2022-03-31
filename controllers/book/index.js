const Book = require("../../models/Book.model");
const catchAsync = require("../../lib/catchAsync");

// create book api
const createBook = catchAsync(async (req, res) => {
  const filters = {
    isDeleted: false,
    accessCode: req.body.accessCode,
  };
  // checking book already exist
  const doc = await Book.findOne(filters);
  if (doc) {
    return res.status(400).json({ Message: "Use Different Access Code" });
  }
  const book = await Book.create(req.body);
  return res.status(201).json("Created");
});

// updating book
const updateBook = catchAsync(async (req, res) => {
  const updateData = await Book.findOneAndUpdate(
    {
      id: req.body.id,
      isDeleted: false,
    },
    req.body,
    { new: true }
  );
  return res.status(400).json("Updated Successfully");
});

const getBooks = catchAsync(async (req, res) => {
  const filters = {
    isDeleted: false,
  };

  // filter query
  if (req.query.title) {
    filters.title = new RegExp(req.query.title.toLowerCase());
  }

  if (req.query.accessCode) {
    filters.accessCode = new RegExp(req.query.accessCode.toLowerCase());
  }

  if (req.query.category) {
    filters.category = req.query.category;
  }

  // RegExp is using for getting details even after typing few letters
  if (req.query.author) {
    filters.author = req.query.author;
  }

  const result = await Book.find(filters).populate("author");
  return res.status(200).json(result);
});

// delete Book
const deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findOneAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  return res.status(200).json("Deleted");
});

const incrementVisitCount = catchAsync(async (req, res) => {
  const book = await Book.findOneAndUpdate(req?.params?.id, {
    $inc: { visitor: 1 },
  });

  return res.status(200).json(book);
});

const getBookById = catchAsync(async (req, res) => {
  const book = await Book.findOne(req.params.id);
  return res.status(200).json(book);
});

const getBookByCode = catchAsync(async (req, res, next) => {
  const book = await Book.findOne({
    accessCode: req.body?.accessCode,
    isDeleted: false,
  }).populate("author");
  if (!book) {
    return res.status(400).json({ message: "Book Not Found" });
  }
  return res.status(200).json(book);
});

module.exports = {
  createBook,
  updateBook,
  getBooks,
  getBookById,
  getBookByCode,
  deleteBook,
  incrementVisitCount,
};
