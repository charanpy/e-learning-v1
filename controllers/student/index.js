const { hash } = require("../../services/password");
const AppError = require("../../errors/AppError");
const catchAsync = require("../../lib/catchAsync");
const Student = require("../../models/Students.model");
const { generateOtp } = require("../../services/otp-generate");

// creating student
const createStudent = catchAsync(async (req, res, next) => {
  // checking member role and updating rollnumber as "0000" to identify as member
  if (req.body?.role !== "student") {
    req.body["rollNumber"] = "0000";
  }
  if (req.body?.role === "student") {
    if (!req.body?.rollNumber) {
      return next(new AppError("RollNumber is required", 400));
    }
  }
  // checking all the details are filled
  if (!req.body.name || !req.body.email)
    return next(new AppError("Some Field is required", 400));

  req.body["password"] = await hash(generateOtp());
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

module.exports = {
  createStudent,
  deleteStudent,
  getStudent,
  updateStudent,
  dismissStudent,
  getMember,
};
