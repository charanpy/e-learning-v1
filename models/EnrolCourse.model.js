const mongoose = require('mongoose');

const EnrolCourseSchema = new mongoose.Schema({
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
});

const EnrolCourse = mongoose.model('EnrolCourse', EnrolCourseSchema);

module.exports = EnrolCourse;
