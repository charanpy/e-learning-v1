const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const getRequiredFieldMessage = require("../errors/error-handling");
const getDueAmount = require("../lib/compare-date");
const addDate = require("../lib/date.js");

const BookIssueSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: getRequiredFieldMessage("Student"),
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    rollNumber: {
      type: String,
      required: getRequiredFieldMessage("Student Roll Number"),
    },
    accessCode: {
      type: String,
      required: getRequiredFieldMessage("Book AccessCode"),
    },
    issuedDate: {
      type: Date,
      default: new Date(),
      required: getRequiredFieldMessage("issuedDate"),
    },
    dueDate: {
      type: Date,
      default: function () {
        return addDate(this.issuedDate);
      },
      required: getRequiredFieldMessage("dueDate"),
    },
    bookReturn: {
      type: Boolean,
      default: false,
    },
    returnedDate: {
      type: Date,
    },
    renewal: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

BookIssueSchema.virtual("dueAmount").get(function () {
  return getDueAmount(this.dueDate);
});

const BookIssue = mongoose.model("BookIssue", BookIssueSchema);

module.exports = BookIssue;
