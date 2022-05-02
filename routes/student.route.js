const express = require("express");
const { upload } = require("../lib/multer");

const {
  createStudent,
  getStudent,
  deleteStudent,
  updateStudent,
  getMember,
  dismissStudent,
  login,
  getMe,
  pendingRequest,
  updateProfileImage,
  approveStudent,
  getStudentByRollNumber,
  createStudentByAdmin,
} = require("../controllers/student");
const { checkToken, checkRole } = require("../services/auth");

const router = express.Router();

router.route("/").post(createStudent).get(getStudent);
router
  .route("/photo")
  .post(checkToken, upload().single("file"), updateProfileImage);
router.route("/me").get(checkToken, checkRole("student"), getMe);
router.route("/login").post(login);
router.route("/member").get(getMember);
router.route("/pending-request").get(pendingRequest);

router.route("/dismiss-student/:id").delete(dismissStudent);
router.route("/approve-student/:id").put(approveStudent);
router.route("/:id").delete(deleteStudent).put(updateStudent);
router
  .route("/rollNumber/:rollNumber")
  .get(checkToken, checkRole("admin"), getStudentByRollNumber);
router.route("/create-student").post(createStudentByAdmin);
module.exports = router;
