const AppError = require('../../errors/AppError');
const catchAsync = require('../../lib/catchAsync');
const { uploadFileHelper } = require('../../lib/s3');
const Course = require('../../models/Course.model');

const createCourse = catchAsync(async (req, res, next) => {
  const { title, description, code, courseDuration } = req.body;

  if (!req?.file)
    return next(new AppError('Course thumbnail is required', 400));

  if (!title || !description || !code || !courseDuration)
    return next(new AppError('Please fill all fields', 400));

  const image = await uploadFileHelper(req?.file, 'course');
  if (image) req.body['image'] = image;

  const course = await Course.create(req.body);

  return res.status(201).json(course);
});

const getCourse = catchAsync(async (req, res) => {
  const filters = { isDeleted: false };
  if (req.query?.code) filters['code'] = req.query?.code;
  if (req.query?.title) filters['title'] = new RegExp(req.query?.title);
});

module.exports = {
  createCourse,
};
