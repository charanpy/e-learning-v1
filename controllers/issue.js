const AppError = require("../errors/AppError");
const catchAsync = require("../lib/catchAsync");
const Issue = require("../models/Issue.model");
const Order = require("../models/Order.model");

const createIssue = catchAsync(async (req, res, next) => {
  const { course, issue } = req.body;

  if (!course || !issue) return next(new AppError("Issue is required", 400));

  const order = await Order.findOne({
    course,
    user: req.user?.id,
    status: "pending",
  });

  await Issue.create({
    courseTitle: req.body?.courseTitle || "",
    course,
    issue,
    user: req.user?.id,
    order: order?._id,
  });

  return res.status(200).json("Issue created");
});

const deleteIssue = catchAsync(async (req, res, next) => {
  await Issue.findByIdAndDelete(req.params?.id);
  return res.status(200).json("Deleted");
});

const getIssue = catchAsync(async (_, res) => {
  const issue = await Issue.find({}).populate("order");

  return res.status(200).json(issue);
});

// get issue by id
const getIssueById = catchAsync(async (req, res, next) => {
  const issue = await Issue.findById(req.params.id).populate("order");
  if (!issue) return next(new AppError("Issue Not Found", 400));
  return res.status(200).json(issue);
});

module.exports = {
  createIssue,
  deleteIssue,
  getIssue,
  getIssueById,
};
