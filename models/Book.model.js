const mongoose = require("mongoose");
const getRequiredFieldMessage = require("../errors/error-handling");
const FileSchema = require("./File.schema");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: getRequiredFieldMessage("Book Title"),
      lowercase: true,
    },
    description: {
      type: String,
      lowercase: true,
    },
    accessCode: {
      type: Number,
      required: getRequiredFieldMessage("Access Code"),
      unique: [true, "Access Code Already Exist"],
    },
    // availability: {
    //   type: Number,
    //   default: 1,
    // },
    category: {
      type: String,
      required: getRequiredFieldMessage("Category"),
    },
    publishedYear: {
      type: String,
      required: getRequiredFieldMessage("Publish Year"),
    },
    publisher: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    // course: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Course",
    // },
    price: {
      type: Number,
      required: getRequiredFieldMessage("Price"),
    },
    edition: {
      type: Number,
      required: getRequiredFieldMessage("Edition"),
    },
    language: {
      type: String,
      required: getRequiredFieldMessage("Language"),
    },
    totalBooks: {
      type: Number,
      required: getRequiredFieldMessage("Total Book Number"),
    },
    damageStatus: {
      type: String,
    },
    location: {
      type: String,
    },
    visitor: {
      type: Number,
      default: 0,
    },
    totalPages: {
      type: Number,
      default: 0,
    },
    image: {
      type: FileSchema,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
