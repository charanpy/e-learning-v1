const mongoose = require("mongoose");
const getRequiredFieldMessage = require("../errors/error-handling");
const { v4: uuidv4 } = require("uuid");

const VideoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    title: {
      type: String,
      required: getRequiredFieldMessage("Video Title"),
      lowercase: true,
    },
    description: {
      type: String,
      required: getRequiredFieldMessage(" Video Description "),
      lowercase: true,
    },
    videoDuration: {
      type: String,
      required: getRequiredFieldMessage("Video Duration"),
    },
    watchCount: {
      type: Number,
      required: getRequiredFieldMessage("Watch Count"),
    },
    priority: {
      type: Number,
      required: getRequiredFieldMessage("Priority"),
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
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

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
