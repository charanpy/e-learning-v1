const mongoose = require('mongoose');
const getRequiredFieldMessage = require('../errors/error-handling');

const FileSchema = new mongoose.Schema({
  key: {
    type: String,
    required: getRequiredFieldMessage('File'),
  },
  url: {
    type: String,
    required: getRequiredFieldMessage('File'),
  },
});

module.exports = FileSchema;
