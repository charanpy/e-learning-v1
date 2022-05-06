const mongoose = require('mongoose');
const getRequiredFieldMessage = require('../errors/error-handling');
const FileViewSchema = new mongoose.Schema(
  {
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      required: getRequiredFieldMessage('Material'),
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: getRequiredFieldMessage('Student'),
    },
  },
  { timestamps: true }
);

FileViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const FileView = mongoose.model('FileView', FileViewSchema);

module.exports = FileView;
