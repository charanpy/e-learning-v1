const mongoose = require('mongoose');
const getRequiredFieldMessage = require('../errors/error-handling');
const { v4: uuidv4 } = require("uuid");

const AuthorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    authorName: {
      type: String,
      required: getRequiredFieldMessage('Author Name'),
      lowercase: true,
    },
    authorEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
