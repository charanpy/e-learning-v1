const express = require("express");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const errorController = require("./errors/error-controller");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

const materialRoutes = require("./routes/material.route");
const authorRoutes = require("./routes/author.route");
const courseRoutes = require("./routes/course.route");
const videoRoutes = require("./routes/videos.route");
const studentRoutes = require("./routes/student.route");
const bookRoutes = require("./routes/book.route");

app.use("/api/v2/author", authorRoutes);
app.use("/api/v2/course", courseRoutes);
app.use("/api/v2/material", materialRoutes);
app.use("/api/v2/student", studentRoutes);
app.use("/api/v2/video", videoRoutes);
app.use("/api/v2/book", bookRoutes);
app.use("*", (_, res) => {
  return res.status(404).json({ message: "Requested resource not found" });
});
app.use(errorController);

module.exports = app;
