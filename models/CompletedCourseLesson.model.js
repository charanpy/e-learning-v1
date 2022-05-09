const mongoose = require('mongoose');

const CompletedCourseLessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    completedCount: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Map,
      of: new mongoose.Schema({
        completedAt: {
          type: Date,
          default: Date.now(),
        },
        status: Number,
      }),
    },
  },
  { timestamps: true }
);

const CompletedCourseLesson = mongoose.model(
  'CompletedCourseLesson',
  CompletedCourseLessonSchema
);

module.exports = CompletedCourseLesson;
