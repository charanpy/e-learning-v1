const AppError = require("../../errors/AppError");
const catchAsync = require("../../lib/catchAsync");
const Student = require("../../models/Students.model");

const createStudent = catchAsync(async (req, res, next) => {
  if (req.body?.role !== "student") {
    if (req.body?.rollNumber) req.body.rollNumber = null;
  }
  const student = await Student.create(req.body);
  return res.status(201).json(student);
});

const getStudent = catchAsync(async (req, res, next) => {
  const filters = {
    isDeleted: false,
    role: "student",
  };
  if (req.query.name) {
    filters.name = req.query?.name?.toLowerCase();
  }
  if (req.query.rollNumber) {
    filters.rollNumber = req.query?.rollNumber?.toLowerCase();
  }
  if (req.query.year) {
    filters.year = req.query.year;
  }
  const student = await Student.find(filters, { password: false });

  return res.status(200).json(student);
});
const getMember = catchAsync(async (req, res, next) => {
  const filters = {
    isDeleted: false,
    role: "member",
  };
  if (req.query.name) {
    filters.name = req.query?.name?.toLowerCase();
  }
  const student = await Student.find(filters, { password: false });

  return res.status(200).json(student);
});

const updateStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req?.params?.id);
  if (!student) return next(new AppError("No Student found", 404));

  for (let field in req.body) {
    student[field] = req.body[field];
  }
  await student.save();

  return res.status(200).json(student);
});
const deleteStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findByIdAndUpdate(
    req.params?.id,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );
  return res.status(200).json(student);
});

module.exports = {
  createStudent,
  deleteStudent,
  getStudent,
  updateStudent,
  getMember,
};
