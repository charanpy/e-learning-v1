const mongoose = require('mongoose');
const getRequiredFieldMessage = require('../errors/error-handling');
const FileSchema = require('./File.schema');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: getRequiredFieldMessage('Course Title'),
      lowercase: true,
    },
    code: {
      type: String,
      required: getRequiredFieldMessage('Course code'),
      unique: [true, 'Course code should be unique'],
    },
    description: {
      type: String,
      required: getRequiredFieldMessage('Course description'),
      lowercase: true,
    },
    courseDuration: {
      type: String,
      required: getRequiredFieldMessage('Course Duration'),
    },
    image: {
      type: FileSchema,
      required: getRequiredFieldMessage('image Required'),
    },
    instructors: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    price: Number,
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
