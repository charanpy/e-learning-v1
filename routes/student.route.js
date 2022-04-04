const express = require("express");
const {
  createStudent,
  getStudent,
  deleteStudent,
  updateStudent,
  getMember,
  dismissStudent,
} = require("../controllers/student");

const router = express.Router();

router.route("/").post(createStudent).get(getStudent);
router.route("/member").get(getMember);

router.route("/dismiss-student/:id").delete(dismissStudent);
router.route("/:id").delete(deleteStudent).put(updateStudent);

module.exports = router;
