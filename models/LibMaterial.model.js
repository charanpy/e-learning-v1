const mongoose = require('mongoose');
const getRequiredFieldMessage = require('../errors/error-handling');
const FileSchema = require('./File.schema');

const LibMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: getRequiredFieldMessage('Title'),
    },
    preferredYear: [],
    file: {
      type: FileSchema,
      required: getRequiredFieldMessage('File'),
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
      // required: getRequiredFieldMessage('Category'),
    },
  },
  { timestamps: true }
);

const LibMaterial = mongoose.model('LibMaterial', LibMaterialSchema);

module.exports = LibMaterial;
