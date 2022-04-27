const AppError = require('../../errors/AppError');
const catchAsync = require('../../lib/catchAsync');
const { uploadFileHelper, updateFileHelper } = require('../../lib/s3');
const Course = require('../../models/Course.model');
const Video = require('../../models/Videos.model');
const Material = require('../../models/Material.model');

const createCourse = catchAsync(async (req, res, next) => {
  const { courseTitle, description, code, courseDuration } = req.body;

  // if (!req?.file)
  //   return next(new AppError('Course thumbnail is required', 400));

  if (!courseTitle || !description || !code || !courseDuration)
    return next(new AppError('Please fill all fields', 400));

  const image = await uploadFileHelper(req?.file, 'course');
  if (image) req.body['image'] = image;

  const course = await Course.create(req.body);

  return res.status(201).json(course);
});

const getCourse = catchAsync(async (req, res) => {
  const filters = { isDeleted: false };
  if (req.query?.code) filters['code'] = req.query?.code;
  if (req.query?.courseTitle)
    filters['courseTitle'] = new RegExp(req.query?.courseTitle);

  const courses = await Course.find(filters).sort({ createdAt: -1 });

  return res.status(200).json(courses);
});

// get course by id
const getCourseById = catchAsync(async (req, res) => {
  const filters = { isDeleted: false };
  const course = await Course.findById(req.params?.id, { filters }).lean();
  if (!course) return next(new AppError('Course not found', 404));

  const videoCount = Video.find({
    course: req.params.id,
  });
  const materialCount = Material.find({
    course: req.params.id,
  });

  const count = await Promise.all([videoCount, materialCount]);

  course.count = count;
  console.log(course);
  return res.status(200).json(course);
});

const deleteCourse = catchAsync(async (req, res) => {
  await Course.findByIdAndUpdate(req.params?.id, { isDeleted: true });

  return res.status(200).json('Course deleted');
});

const updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params?.id);

  if (!course) return next(new AppError('Course not found', 404));

  const image = await updateFileHelper(req?.file, course?.image?.key, 'course');
  if (image) req.body['image'] = image;

  for (let field in req.body) {
    course[field] = req.body[field];
  }

  await course.save();

  return res.status(200).json(course);
});

module.exports = {
  createCourse,
  getCourse,
  getCourseById,
  deleteCourse,
  updateCourse,
};
