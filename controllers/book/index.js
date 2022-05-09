const Book = require("../../models/Book.model");
const catchAsync = require("../../lib/catchAsync");
const booksCategory = require("./book-category.controller");
const { uploadFileHelper, updateFileHelper } = require("../../lib/s3");
const AppError = require("../../errors/AppError");
const Author = require("../../models/Author.model");
const Category = require("../../models/Category.model");
const { authorLookup, categoryLookup } = require("./helper");
const paginate = require("../../lib/paginate");

// create book api
const createBook = catchAsync(async (req, res) => {
  const filters = {
    isDeleted: false,
    accessCode: req.body.accessCode,
  };
  // checking book already exist
  const doc = await Book.findOne(filters);
  if (doc) {
    return res.status(400).json({ message: "Use Different Access Code" });
  }
  // uploading image file
  const image = await uploadFileHelper(req?.file, "book");
  if (image) req.body["image"] = image;
  // creating book
  const book = await Book.create(req.body);
  return res.status(201).json("Created");
});

// updating book
const updateBook = catchAsync(async (req, res) => {
  const book = await Book.findById(req.params?.id);

  if (!book) return next(new AppError("book not found", 404));

  const image = await updateFileHelper(req?.file, book?.image?.key, "book");
  if (image) req.body["image"] = image;

  const updateData = await Book.findOneAndUpdate(
    {
      _id: req.params.id,
      isDeleted: false,
    },
    req.body,
    { new: true }
  );
  return res.status(200).json("Updated Successfully");
});

const getBooks = catchAsync(async (req, res) => {
  const { limit, skip } = paginate(req);

  const filters = [{ isDeleted: false }];

  if (req.query?.title) filters.push({ title: new RegExp(req.query.title) });
  if (req.query?.accessCode)
    filters.push({ accessCode: new RegExp(req.query.accessCode) });
  if (req.query?.publisher)
    filters.push({ publisher: new RegExp(req.query.publisher) });

  const aggregate = [{ $match: { $and: filters } }];

  aggregate.push(authorLookup(req.query.author));
  aggregate.push({ $unwind: "$author" });

  aggregate.push(categoryLookup(req.query.category));

  aggregate.push({ $match: { category: { $ne: [] } } });

  aggregate.push({
    $group: {
      _id: null,
      count: { $sum: 1 },
      data: { $push: "$$ROOT" },
    },
  });

  aggregate.push({
    $project: {
      count: 1,
      data: {
        $slice: ["$data", skip, limit],
      },
    },
  });

  const result = await Book.aggregate(aggregate);

  console.log("====================================");
  console.log(result?.[0]?.data?.length);
  console.log("====================================");
  return res.status(200).json(result?.[0] || null);
});

// delete Book
const deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );

  return res.status(200).json("Deleted");
});

const incrementVisitCount = catchAsync(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req?.params?.id, {
    $inc: { visitor: 1 },
  });

  return res.status(200).json(book);
});

const getBookById = catchAsync(async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id });
  return res.status(200).json(book);
});

const getBookByCode = catchAsync(async (req, res, next) => {
  const book = await Book.findOne({
    accessCode: req.body?.accessCode,
    isDeleted: false,
  })
    .populate({path:'category',select:'categoryName'})
    .populate("author");

  if (!book) {
    return res.status(400).json({ message: "Book Not Found" });
  }
  return res.status(200).json(book);
});

// books category

const getBooksCategory = catchAsync(async (req, res) => {
  const categoryList = booksCategory.sort();
  return res.status(200).json(categoryList);
});

module.exports = {
  createBook,
  updateBook,
  getBooks,
  getBookById,
  getBookByCode,
  deleteBook,
  incrementVisitCount,
  getBooksCategory,
};
