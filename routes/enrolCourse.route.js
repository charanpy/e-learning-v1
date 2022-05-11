const express = require("express");
const {
  getCourseEnrolRequest,
  requestCourseEnrol,
  acceptUserEnrollment,
  getUserEnrolledCourse,
  getEnrolCourseById,
  rejectUserEnrollment,
  getEnrolledCourse,
  updateRecentWatched,
  getStudentsByCourseID,
} = require("../controllers/enrol-course");
const { checkToken, checkRole } = require("../services/auth");

const router = express.Router();

router
  .route("/")
  .get(getCourseEnrolRequest)
  .post(checkToken, checkRole("student"), requestCourseEnrol);
router.route("/access").get(getEnrolledCourse);
router.route("/access/:id").get(getStudentsByCourseID);
router.route("/recently-watched").post(checkToken, updateRecentWatched);
router.route("/my-course").get(checkToken, getUserEnrolledCourse);
router.route("/accept").post(acceptUserEnrollment);
router.route("/reject").post(rejectUserEnrollment);
router.route("/:id").get(checkToken, getEnrolCourseById);

module.exports = router;
