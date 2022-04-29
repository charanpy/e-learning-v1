const mongoose = require('mongoose');
const getRequiredFieldMessage = require('../errors/error-handling');

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: getRequiredFieldMessage('username'),
      lowercase: true,
    },
    password: {
      type: String,
      required: getRequiredFieldMessage('password'),
    },
    email: {
      type: String,
      required: getRequiredFieldMessage('email'),
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: getRequiredFieldMessage('Mobile Number'),
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
