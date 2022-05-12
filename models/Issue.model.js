const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  courseTitle: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  issue: String,
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
});

IssueSchema.index({ course: 1, user: 1, order: 1 }, { unique: true });

const Issue = mongoose.model('Issue', IssueSchema);

module.exports = Issue;
