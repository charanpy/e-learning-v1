const mongoose = require('mongoose');

const EnrolCourseSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
    access: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
    },
    recentWatched: {
      title: String,
      lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
      },
      priority: Number,
    },
  },
  { timestamps: true }
);

EnrolCourseSchema.index({ user: 1, course: 1 }, { unique: true });

const EnrolCourse = mongoose.model('EnrolCourse', EnrolCourseSchema);

module.exports = EnrolCourse;
