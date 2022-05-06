const Author = require("../../models/Author.model");
const AppError = require("../../errors/AppError");
const catchAsync = require("../../lib/catchAsync");
const paginate = require("../../lib/paginate");

const createAuthor = catchAsync(async (req, res, next) => {
  const { authorName } = req.body;

  if (!authorName) return next(new AppError("Name is required", 400));

  const author = await Author.create(req.body);

  return res.status(201).json({
    author,
  });
});

const getAuthor = catchAsync(async (req, res) => {
  const { skip, limit } = paginate(req);
  const filters = {
    isDeleted: false,
  };

  let count = 0;

  if (req.query?.authorName)
    filters["authorName"] = new RegExp(req.query?.authorName);

  count = await Author.countDocuments(filters);

  const authors = await Author.find(filters)
    .sort({ authorName: 1 })
    .skip(skip)
    .limit(limit);
  return res.status(200).json({ count: count || undefined, authors });
});

const getAuthorById = catchAsync(async (req, res) => {
  const author = await Author.findOne({ id: req.params.id });
  if (!author) return next(new AppError("Author details not found", 400));
  return res.status(200).json(author);
});

const updateAuthor = catchAsync(async (req, res) => {
  await Author.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  return res.status(200).json({ message: "updated" });
});

const deleteAuthor = catchAsync(async (req, res, next) => {
  const removedDoc = await Author.findOneAndDelete({ id: req.params.id });
  if (!removedDoc) return next(new AppError("Author not found", 404));

  return res.status(200).json({ message: "Author removed successfully" });
});

module.exports = {
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorById,
  getAuthor,
};
