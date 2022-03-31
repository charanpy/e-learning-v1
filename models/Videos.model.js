const mongoose = require('mongoose');
const getRequiredFieldMessage = require('../errors/error-handling');

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: getRequiredFieldMessage('Video Title'),
      lowercase: true,
    },
    description: {
      type: String,
      required: getRequiredFieldMessage(' Video Description '),
      lowercase: true,
    },
    videoDuration: {
      type: String,
      required: getRequiredFieldMessage('Video Duration'),
    },
    watchCount: {
      type: Number,
      required: getRequiredFieldMessage('Watch Count'),
    },
    priority: {
      type: Number,
      required: getRequiredFieldMessage('Priority'),
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;
