const express = require("express");
const {
  createIssue,
  getIssue,
  deleteIssue,
  getIssueById,
} = require("../controllers/issue");
const { checkRole, checkToken } = require("../services/auth");

const router = express.Router();

router
  .route("/")
  .post(checkToken, createIssue)
  .get(checkToken, checkRole("admin"), getIssue);

router
  .route("/:id")
  .delete(checkToken, checkRole("admin"), deleteIssue)
  .get(checkToken, checkRole("admin"), getIssueById);

module.exports = router;
