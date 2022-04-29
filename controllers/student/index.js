const AppError = require("../../errors/AppError");
const catchAsync = require("../../lib/catchAsync");
const Student = require("../../models/Students.model");
const { verify, hash } = require("../../services/password");
const { generate } = require("../../services/token");

// creating student
const createStudent = catchAsync(async (req, res, next) => {
  // checking member role
  if (req.body?.role !== "student") {
    if (req.body?.rollNumber) req.body.rollNumber = null;
  }
  const student = await Student.create(req.body);
  return res.status(201).json(student);
});

// geting students
const getStudent = catchAsync(async (req, res, next) => {
  // filters section
  const filters = {
    isDeleted: false,
    isVerified: true,
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

// geting members using role filter
const getMember = catchAsync(async (req, res, next) => {
  const filters = {
    isDeleted: false,
    isVerified: true,
    role: "member",
  };
  if (req.query.name) {
    filters.name = req.query?.name?.toLowerCase();
  }
  const student = await Student.find(filters, { password: false });

  return res.status(200).json(student);
});

// updating student details
const updateStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req?.params?.id, { isDeleted: false });
  if (!student) return next(new AppError("No Student found", 404));

  for (let field in req.body) {
    student[field] = req.body[field];
  }
  await student.save();

  return res.status(200).json(student);
});

// delete unverified student
const dismissStudent = catchAsync(async (req, res) => {
  // checking request
  const doc = await Student.findById(req?.params?.id, {
    isVerified: false,
  });
  if (!doc) {
    return res.status(400).json({ message: "Student Not Found" });
  }
  // deleteing request
  const student = await Student.findByIdAndDelete(req.params.id, {
    isVerified: false,
  });
  return res.status(200).json("Dismissed");
});

// changing student delete status
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

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError("Invalid credentials"));

  const student = await Student.findOne({
    email,
    isVerified: true,
    isDeleted: false,
  }).lean();

  if (!student) return next(new AppError("Invalid credentials"));
  if (!(await verify(password, student?.password)))
    return next(new AppError("Invalid credentials"));

  const token = await generate({ id: student?._id, role: student?.role });

  student["password"] = undefined;
  return res.status(200).json({ student, token });
});

const getMe = catchAsync(async (req, res, next) => {
  const user = await Student.findById({
    _id: req?.user?.id,
    isDeleted: false,
    isVerified: true,
  });
  if (!user) return next(new AppError("Not Authorized", 401));

  return res.status(200).json(user);
});

module.exports = {
  createStudent,
  deleteStudent,
  getStudent,
  updateStudent,
  dismissStudent,
  getMember,
  login,
  getMe,
};
