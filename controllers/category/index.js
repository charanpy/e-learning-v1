const catchAsync = require('../../lib/catchAsync');
const Category = require('../../models/Category.model');

const createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  return res.status(201).json(category);
});

const getCategory = catchAsync(async (req, res, next) => {
  const category = await Category.find({});

  return res.status(201).json(category);
});

const deleteCategory = catchAsync(async (req, res, next) => {
  await Category.findByIdAndDelete(req.params?.id);

  return res.status(201).json('Deleted');
});

module.exports = {
  getCategory,
  createCategory,
  deleteCategory,
};
