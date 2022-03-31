const mongoose = require('mongoose');
const getRequiredFieldMessage = require('../errors/error-handling');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: getRequiredFieldMessage('Course Title'),
      lowercase: true,
    },
    description: {
      type: String,
      required: getRequiredFieldMessage('Course description'),
      lowercase: true,
    },
    courseDuration: {
      type: Number,
      required: getRequiredFieldMessage('Course Duration'),
    },
    image: {
      type: String,
      required: getRequiredFieldMessage('image Required'),
    },
    instructors: [],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
