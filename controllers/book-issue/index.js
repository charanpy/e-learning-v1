const catchAsync = require("../../lib/catchAsync");
const BookIssue = require("../../models/book-issue.model");
const Book = require("../../models/book-issue.model");
const Student = require("../../models/Students.model");

// creating book issued request
const createBookIssue = catchAsync(async (req, res) => {
  // checking book count
  const student = await Student.findOne({
    _id: req.body.studentId,
    isDeleted: false,
    role: "student",
  });
  if (!student) {
    return res.status(400).json({ message: "Student Not Found" });
  }

  const book = await BookIssue.findOne({
    bookId: req.body.bookId,
    studentId: req.body.studentId,
    bookReturn: false,
  });

  if (book) {
    return res
      .status(400)
      .json({ message: "Select Different StudentId or BookId" });
  }

  req.body["rollNumber"] = student.rollNumber;
  const bookDetails = await Book.findById(req.body.bookId);

  if (bookDetails) {
    const bookCount = bookDetails.totalBooks;
    if (bookCount > 0) {
      req.body["accessCode"] = bookDetails.accessCode;
      const result = await BookIssue.create(req.body);
      // update book count
      await Book.findOneAndUpdate(
        {
          _id: req.body.bookId,
        },
        {
          totalBooks: bookCount - 1,
        },
        { new: true }
      );
      return res.status(201).json(result);
    }
    return res.status(400).json({ message: "Book Not Available" });
  }
  return res.status(400).json({ message: "Book Not Found" });
});

// get issued books api
const getBookIssuedList = catchAsync(async (req, res) => {
  const filters = {
    bookReturn: false,
  };

  if (req.query.accessCode) {
    filters.accessCode = new RegExp(req.query.accessCode.toLowerCase());
  }

  if (req.query.rollNumber) {
    filters.rollNumber = new RegExp(req.query.rollNumber.toLowerCase());
  }

  const data = await BookIssue.find(filters)
    .populate("studentId", {
      password: false,
    })
    .populate("bookId");
  return res.status(200).json(data);
});

// get returned book list
const getReturnedBookList = catchAsync(async (req, res) => {
  const filters = {
    bookReturn: true,
  };

  const data = await BookIssue.find(filters)
    .populate("studentId", {
      password: false,
    })
    .populate("bookId");
  return res.status(200).json(data);
});

// get due book list
const getDueBookList = catchAsync(async (req, res) => {
  const filters = {
    bookReturn: false,
    dueDate: { $lt: new Date() },
  };

  if (req.query.accessCode) {
    filters.accessCode = new RegExp(req.query.accessCode.toLowerCase());
  }

  if (req.query.rollNumber) {
    filters.rollNumber = new RegExp(req.query.rollNumber.toLowerCase());
  }
  const data = await BookIssue.find(filters)
    .populate("studentId", {
      password: false,
    })
    .populate("bookId");
  return res.status(200).json(data);
});

// return book
const returnBook = catchAsync(async (req, res) => {
  const bookId = req.body.bookId;

  // updating availability of book
  const data = await Book.findOneAndUpdate(
    { _id: bookId },
    { $inc: { totalBooks: 1 } },
    { new: true }
  );

  // changing book return status
  if (!data) {
    return res.status(400).json({ message: "Fail to Return" });
  }
  const bookIssue = await BookIssue.findOneAndUpdate(
    { _id: req.params.id },
    { bookReturn: true, returnedDate: new Date() },
    { new: true }
  );

  return res.status(200).json(bookIssue);
});

// renewal of book
const renewalBook = catchAsync(async (req, res) => {
  const bookId = req.body.bookId;
  // changing book renewal status
  await BookIssue.findOneAndUpdate(
    { _id: req.params.id },
    { renewal: true },
    { new: true }
  );
  return res.status(200).json({ message: "renewed" });
});

const getStudentReturnedBook = catchAsync(async (req, res) => {
  const filters = {
    bookReturn: true,
    studentId: req?.user?.id,
  };

  const data = await BookIssue.find(filters).populate("bookId");
  return res.status(200).json(data);
});

const getStudentIssuedBook = catchAsync(async (req, res) => {
  const filters = {
    bookReturn: false,
    studentId: req?.user?.id,
  };

  const data = await BookIssue.find(filters).populate("bookId");
  return res.status(200).json(data);
});

module.exports = {
  createBookIssue,
  getBookIssuedList,
  getReturnedBookList,
  getDueBookList,
  returnBook,
  renewalBook,
  getStudentIssuedBook,
  getStudentReturnedBook,
};
