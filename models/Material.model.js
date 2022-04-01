const mongoose = require('mongoose');
const getRequiredFieldMessage = require('../errors/error-handling');
const FileSchema = require('./File.schema');

const MaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: getRequiredFieldMessage('Title'),
    },

    restrictCount: {
      type: Number,
      default: 0,
    },
    restrictAccess: {
      type: Boolean,
      default: function () {
        return !!this.restrictCount;
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: getRequiredFieldMessage('Category'),
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    file: {
      type: FileSchema,
      required: getRequiredFieldMessage('File'),
    },
  },
  {
    timestamps: true,
  }
);

const Material = mongoose.model('Material', MaterialSchema);

module.exports = Material;
