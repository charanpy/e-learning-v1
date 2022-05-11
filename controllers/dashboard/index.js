const catchAsync = require("../../lib/catchAsync");
const Book = require("../../models/Book.model");
const Course = require("../../models/Course.model");
const Student = require("../../models/Students.model");
const EnrolCourse = require("../../models/EnrolCourse.model");
const Order = require("../../models/Order.model");
const BookIssue = require("../../models/book-issue.model");

const getDashboardCountDetails = catchAsync(async (req, res, next) => {
  const [books, course, users, courseEnrole, order, bookIssue] =
    await Promise.all([
      Book.countDocuments({ isDeleted: false }),
      Course.countDocuments({ isDeleted: false }),
      Student.countDocuments({ isDeleted: false }),
      EnrolCourse.countDocuments({ access: true }),
      Order.countDocuments({}),
      BookIssue.countDocuments({}),
    ]);

  const data = [
    {
      title: "Books",
      count: books,
      url: "/books",
      bg: "d1",
    },
    {
      title: "Course",
      count: course,
      url: "/course",
      bg: "d2",
    },
    {
      title: "Users",
      count: users,
      url: "/students",
      bg: "d3",
    },
    {
      title: "Enroled Courses",
      count: courseEnrole,
      url: "/purchased-courses",
      bg: "d2",
    },
    {
      title: "Orders",
      count: order,
      url: "/orders",
      bg: "d3",
    },
    {
      title: "Total Book Issued",
      count: bookIssue,
      url: "/issue-book-dashboard",
      bg: "d1",
    },
  ];
  return res.status(200).json(data);
});

module.exports = {
  getDashboardCountDetails,
};
