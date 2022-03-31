const mongoose = require('mongoose');
const getRequiredFieldMessage = require('../errors/error-handling');

const AuthorSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: getRequiredFieldMessage('Author Name'),
      lowercase: true,
    },
    authorEmail: {
      type: String,
      unique: [true, 'Invalid Email'],
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
