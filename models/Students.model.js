const mongoose = require("mongoose");
const getRequiredFieldMessage = require("../errors/error-handling");
const { generateOtp } = require("../services/otp-generate");

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: getRequiredFieldMessage("Student Name"),
    },
    role: {
      type: String,
      enum: {
        values: ["student", "member"],
        message: "Invalid Role",
      },
      default: "student",
    },
    rollNumber: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    email: {
      type: String,
      required: getRequiredFieldMessage("Student Email"),
      unique: [true, "email Should be unique"],
    },
    password: {
      type: String,
    },
    dob: {
      type: String,
      required: getRequiredFieldMessage("DOB"),
    },
    mobileNumber: {
      type: String,
      required: getRequiredFieldMessage("Mobile Number"),
    },
    year: {
      type: String,
    },
    image: {
      type: String,
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

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
