const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const errorController = require('./errors/error-controller');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

const materialRoutes = require('./routes/material.route');
const authorRoutes = require('./routes/author.route');
const courseRoutes = require('./routes/course.route');
const videoRoutes = require('./routes/videos.route');
const studentRoutes = require('./routes/student.route');
const bookRoutes = require('./routes/book.route');
const bookIssueRoutes = require('./routes/book-issue');
const adminRoutes = require('./routes/admin.route');
const enrolCourseRoutes = require('./routes/enrolCourse.route');
const categoryRoutes = require('./routes/category.route');
const Author = require('./models/Author.model');
const Book = require('./models/Book.model');

app.use('/api/v2/author', authorRoutes);
app.use('/api/v2/course', courseRoutes);
app.use('/api/v2/material', materialRoutes);
app.use('/api/v2/student', studentRoutes);
app.use('/api/v2/video', videoRoutes);
app.use('/api/v2/book', bookRoutes);
app.use('/api/v2/book-issue', bookIssueRoutes);
app.use('/api/v2/admin', adminRoutes);
app.use('/api/v2/enrol-course', enrolCourseRoutes);
app.use('/api/v2/category', categoryRoutes);

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  (request, response) => {
    const payload = request.body;
    // const sig = request.headers['stripe-signature'];

    // let event;

    // try {
    //   event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    // } catch (err) {
    //   return response.status(400).send(`Webhook Error: ${err.message}`);
    // }
    console.log('Payment  ');

    response.status(200);
  }
);

app.use('*', (_, res) => {
  return res.status(404).json({ message: 'Requested resource not found' });
});
app.use(errorController);

module.exports = app;
