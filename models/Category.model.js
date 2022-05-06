const mongoose = require('mongoose');
const getRequiredFieldMessage = require('../errors/error-handling');

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: getRequiredFieldMessage('Category'),
    unique:[true,'Category name should be unique']
  },
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
