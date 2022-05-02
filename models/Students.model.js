const mongoose = require("mongoose");
const getRequiredFieldMessage = require("../errors/error-handling");
const { generateOtp } = require("../services/otp-generate");
const { hash } = require("../services/password");
const FileSchema = require("./File.schema");

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
        return !!this.role === "student";
      },
    },
    email: {
      type: String,
      required: getRequiredFieldMessage("Email"),
      unique: true,
    },
    password: {
      type: String,
      default: generateOtp,
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
      type: FileSchema,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
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

StudentSchema.pre("save", async function (next) {
  this.password = await hash(this.password);
  next();
});

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
