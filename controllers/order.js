const catchAsync = require("../lib/catchAsync");
const paginate = require("../lib/paginate");
const stripe = require("../lib/stripe");
const EnrolCourse = require("../models/EnrolCourse.model");
const Order = require("../models/Order.model");
const Admin = require("../models/Admin.model");

const enrollToCourse = async (metadata) => {
  if (!metadata) return;

  const enrollCourse = EnrolCourse.create({
    user: metadata?.user,
    course: metadata?.course,
    role: metadata?.role || "member",
    access: true,
  });

  const order = Order.findOneAndUpdate({
    user: metadata?.user,
    course: metadata?.course,
    status: "success",
    purchasedAt: Date.now(),
  });

  return Promise.all([enrollCourse, order]);
};

const orderFailed = async (metadata, fail = true) => {
  if (!metadata) return;
  return Order.findOneAndUpdate({
    user: metadata?.user,
    course: metadata?.course,
    status: fail ? "failed" : "cancelled",
  });
};

const createOrderOnWebHookEvent = catchAsync(
  async (request, response, next) => {
    const payload = request.body;
    const sig = request.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_HOOK
    );

    console.log(event.type);
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.payment_status === "paid") {
          await enrollToCourse(session?.metadata);
        } else {
          await orderFailed(session?.metadata);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;

        await enrollToCourse(session?.metadata);
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;

        await orderFailed(session?.metadata);
        break;
      }
      default: {
        const session = event.data.object;
        await orderFailed(session?.metadata, false);
      }
    }

    response.status(200).end();
  }
);

const getOrders = catchAsync(async (req, res, next) => {
  const { limit, skip } = paginate(req);

  const filter = {};

  if (req.query?.status) {
    filter.status = req.query.status;
  }

  const totalCount = await Order.countDocuments(filter);

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const details = {
    count: totalCount,
    data: orders,
  };
  return res.status(200).json(details);
});

// orders by id
const getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("Order not found", 400));
  }
  return res.status(200).json(order);
});

// update order status
const updateOrderStatus = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req?.user?.id);
  if (!admin) {
    return next(new AppError("Permission Denied", 400));
  }

  await Order.findOneAndUpdate(
    { _id: req.params.id },
    { status: req.body.status, updatedBy: req?.user?.id },
    { new: true }
  );

  return res.status(200).json("Status Updated");
});
module.exports = {
  createOrderOnWebHookEvent,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
