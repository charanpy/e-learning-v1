const AppError = require('../../errors/AppError');
const catchAsync = require('../../lib/catchAsync');
const CompletedCourseLesson = require('../../models/CompletedCourseLesson.model');

const status = ['mark', 'ignore'];
const setMarkStatus = catchAsync(async (req, res, next) => {
  if (!status.includes(req.query?.status || ''))
    return next(new AppError('Invalid status', 400));
  const { courseId, lessonId } = req.body;

  if (!courseId || !lessonId)
    return next(new AppError('Course is required', 400));

  let isCompleteCourse = await CompletedCourseLesson.findOne({
    course: courseId,
    user: req?.user?.id,
  });

  if (!isCompleteCourse) {
    isCompleteCourse = await CompletedCourseLesson.create({
      course: courseId,
      user: req?.user?.id,
      completed: new Map(),
    });
  }

  if (req.query.status === 'mark')
    isCompleteCourse.completed.set(lessonId, { status: 1 });
  else isCompleteCourse.completed.set(lessonId, undefined);

  await isCompleteCourse.save();
  return res.status(200).json(isCompleteCourse);
});

const getCompletedCourseLesson = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;

  if (!courseId) return next(new AppError('Course is required', 400));

  const completedLesson = await CompletedCourseLesson.findOne({
    course: courseId,
    user: req?.user?.id,
  });
  console.log(completedLesson);
  return res.status(200).json(completedLesson?.completed || null);
});

module.exports = {
  setMarkStatus,
  getCompletedCourseLesson,
};
