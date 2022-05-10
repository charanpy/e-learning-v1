const catchAsync = require('../lib/catchAsync');
const paginate = require('../lib/paginate');
const stripe = require('../lib/stripe');
const EnrolCourse = require('../models/EnrolCourse.model');
const Order = require('../models/Order.model');

const enrollToCourse = async (metadata) => {
  if (!metadata) return;

  const enrollCourse = EnrolCourse.create({
    user: metadata?.user,
    course: metadata?.course,
    role: metadata?.role || 'member',
    access: true,
  });

  const order = Order.findOneAndUpdate({
    user: metadata?.user,
    course: metadata?.course,
    status: 'success',
    purchasedAt: Date.now(),
  });

  return Promise.all([enrollCourse, order]);
};

const orderFailed = async (metadata, fail = true) => {
  if (!metadata) return;
  return Order.findOneAndUpdate({
    user: metadata?.user,
    course: metadata?.course,
    status: fail ? 'failed' : 'cancelled',
  });
};

const createOrderOnWebHookEvent = catchAsync(
  async (request, response, next) => {
    const payload = request.body;
    const sig = request.headers['stripe-signature'];

    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_HOOK
    );

    console.log(event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(event.data.object.status);
        if (session.payment_status === 'paid') {
          await enrollToCourse(session?.metadata);
        }
        // if (session.)
        // } else {
        //   await orderFailed(session?.metadata);
        // }
        break;
      }
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;

        await enrollToCourse(session?.metadata);
        break;
      }

      case 'checkout.session.async_payment_failed': {
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

  const orders = await Order.find(filter)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(orders);
});

module.exports = { createOrderOnWebHookEvent, getOrders };
