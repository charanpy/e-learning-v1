const AppError = require('../../errors/AppError');
const catchAsync = require('../../lib/catchAsync');
const { uploadFileHelper, updateFileHelper } = require('../../lib/s3');
const Course = require('../../models/Course.model');
const Video = require('../../models/Videos.model');
const Material = require('../../models/Material.model');
const paginate = require('../../lib/paginate');
const Order = require('../../models/Order.model');
const EnrolCourse = require('../../models/EnrolCourse.model');
const stripe = require('../../lib/stripe');

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
  const { skip, limit } = paginate(req);

  const filters = { isDeleted: false };
  if (req.query?.code) filters['code'] = req.query?.code;
  if (req.query?.courseTitle)
    filters['courseTitle'] = new RegExp(req.query?.courseTitle);

  const count = await Course.countDocuments(filters);

  const courses = await Course.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({ courses, count: count || undefined });
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

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const { courseId } = req.body;

  if (!courseId) return next(new AppError('Course Id is required'));

  const course = await Course.findById(courseId).lean();

  if (!course || !course?.price)
    return next(new AppError('Course Not found', 404));

  const isEnrolled = await EnrolCourse.findOne({
    course: courseId,
    user: req?.user?.id,
    access: true,
  });

  if (isEnrolled) return next(new AppError('Course already Enrolled'));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: course?.courseTitle,
            description: course?.description,
            images: [course?.image?.url],
          },
          unit_amount_decimal: course?.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.STRIPE_SUCCESS}${course?._id}`,
    // cancel_url: `${process.env.STRIPE_FAILURE}/${course?._id}`,
    cancel_url: `http://localhost:3000/course/failure/${course?._id}`,
    customer_email: req?.user?.email,
    metadata: {
      user: req?.user?.id,
      course: course?._id + '',
      title: course?.courseTitle,
      role: req?.user?.role,
    },
  });

  console.log(session?.payment_intent, session);

  const order = await Order.findOne({
    user: req?.user?.id,
    course: course?._id,
  });

  if (!order) {
    await Order.create({
      user: req?.user?.id,
      course: course?._id,
      status: 'pending',
      total: course?.price,
      transactionID: session?.payment_intent,
    });
  }

  return res.status(200).json([session?.id, session?.payment_intent]);
});

module.exports = {
  createCourse,
  getCourse,
  getCourseById,
  deleteCourse,
  updateCourse,
  createCheckoutSession,
};
