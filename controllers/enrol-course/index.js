const AppError = require('../../errors/AppError');
const catchAsync = require('../../lib/catchAsync');
const Course = require('../../models/Course.model');
const EnrolCourse = require('../../models/EnrolCourse.model');

const requestCourseEnrol = catchAsync(async (req, res, next) => {
  const { courseId } = req.body;

  if (!courseId) return next(new AppError('Course is required'), 400);

  const isEnrolled = await EnrolCourse.findOne({
    course: courseId,
    user: req.user?.id,
  });

  if (isEnrolled) return next(new AppError('Course Already Requested'));

  const course = await Course.findOne({ _id: courseId, isDeleted: false });

  if (!course) return next(new AppError('No course found', 404));
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
  }).populate('course');

  return res.status(200).json(courses);
});

const acceptUserEnrollment = catchAsync(async (req, res, next) => {
  const { courseId, userId } = req.body;

  if (!courseId || !userId)
    return next(new AppError('Course and user id is required'));
  const course = await EnrolCourse.findOneAndUpdate(
    { course: courseId, user: userId },
    { access: true },
    { new: true }
  );

  return res.status(200).json(course);
});

const getCourseEnrolRequest = catchAsync(async (req, res) => {
  const filters = {};
  if (req.query?.pending) {
    filters['access'] = req.query?.pending;
  }
  if (req.query?.role) {
    filter['role'] = req.query.role;
  }

  const courseEnroll = await EnrolCourse.find(filters);

  return res.status(200).json(courseEnroll);
});

const getEnrolCourseById = catchAsync(async (req, res) => {
  const course = await EnrolCourse.findOne({
    course: req.params?.id,
    user: req?.user?.id,
  });

  return res.status(200).json(course);
});

module.exports = {
  requestCourseEnrol,
  getUserEnrolledCourse,
  acceptUserEnrollment,
  getCourseEnrolRequest,
  getEnrolCourseById,
};
