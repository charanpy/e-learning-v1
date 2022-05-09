const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    total: Number,
    paymentType: String,
    status: String,
    purchasedAt: { type: Date },
  },
  { timestamps: true }
);

OrderSchema.pre(/find/, function () {
  this.populate("user", {
    password: false,
  }).populate("course");
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
