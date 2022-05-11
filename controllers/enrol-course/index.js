const AppError = require("../../errors/AppError");
const catchAsync = require("../../lib/catchAsync");
const Course = require("../../models/Course.model");
const EnrolCourse = require("../../models/EnrolCourse.model");
const paginate = require("../../lib/paginate");

const requestCourseEnrol = catchAsync(async (req, res, next) => {
  const { courseId } = req.body;

  if (!courseId) return next(new AppError("Course is required"), 400);

  const isEnrolled = await EnrolCourse.findOne({
    course: courseId,
    user: req.user?.id,
  });

  if (isEnrolled) return next(new AppError("Course Already Requested"));

  const course = await Course.findOne({ _id: courseId, isDeleted: false });

  if (!course) return next(new AppError("No course found", 404));
  const requestedCourse = await EnrolCourse.create({
    course: courseId,
    user: req?.user?.id,
    role: req?.user?.role,
  });

  return res.status(201).json(requestedCourse);
});

const getUserEnrolledCourse = catchAsync(async (req, res) => {
  const courses = await EnrolCourse.find({
    user: req.user?.id,
    access: true,
  })
    .populate("course")
    .sort({ updatedAt: -1 });

  return res.status(200).json(courses);
});

const acceptUserEnrollment = catchAsync(async (req, res, next) => {
  const { courseId, userId } = req.body;

  if (!courseId || !userId)
    return next(new AppError("Course and user id is required"));
  const course = await EnrolCourse.findOneAndUpdate(
    { course: courseId, user: userId },
    { access: true },
    { new: true }
  );

  return res.status(200).json(course);
});

const rejectUserEnrollment = catchAsync(async (req, res, next) => {
  const { courseId, userId } = req.body;
  if (!courseId || !userId)
    return next(new AppError("Course and user id is required"));

  await EnrolCourse.findOneAndDelete({ course: courseId, user: userId });

  return res.status(200).json("Deleted Successfully");
});

const getEnrolledCourse = catchAsync(async (req, res, next) => {
  const { limit, skip } = paginate(req);

  const totalCount = await EnrolCourse.countDocuments({});

  const enrolledCourses = await EnrolCourse.find({})
    .populate("course")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const details = {
    count: totalCount,
    data: enrolledCourses,
  };

  return res.status(200).json(details);
});

const getStudentsByCourseID = catchAsync(async (req, res) => {
  const courseId = req.params.id;
  const students = await EnrolCourse.find({
    course: courseId,
  }).populate("user").populate("course");
  return res.status(200).json(students);
});

const getCourseEnrolRequest = catchAsync(async (req, res) => {
  const filters = {
    access: false,
  };
  if (req.query?.pending) {
    filters["access"] = req.query?.pending;
  }
  if (req.query?.role) {
    filters["role"] = req.query.role;
  }

  const courseEnroll = await EnrolCourse.find(filters)
    .populate("course")
    .populate("user");

  return res.status(200).json(courseEnroll);
});

const getEnrolCourseById = catchAsync(async (req, res) => {
  const course = await EnrolCourse.findOne({
    course: req.params?.id,
    user: req?.user?.id,
  });

  return res.status(200).json(course);
});

const updateRecentWatched = catchAsync(async (req, res, next) => {
  const { courseId, title, priority, lectureId } = req.body;
  if (!courseId || !title || !priority || !lectureId)
    return next(new AppError("Course is required", 400));

  const course = await EnrolCourse.findOneAndUpdate(
    { user: req?.user?.id, course: courseId },
    { recentWatched: { title, lecture: lectureId, priority } },
    { new: true }
  );
  console.log(course);
  return res.status(200).json("Successfully updated");
});

module.exports = {
  requestCourseEnrol,
  getUserEnrolledCourse,
  acceptUserEnrollment,
  getCourseEnrolRequest,
  getEnrolCourseById,
  rejectUserEnrollment,
  getEnrolledCourse,
  updateRecentWatched,
  getStudentsByCourseID,
};
