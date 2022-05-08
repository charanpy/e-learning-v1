const express = require("express");
const { getDashboardCountDetails } = require("../controllers/dashboard");
const { checkRole, checkToken } = require("../services/auth");

const router = express.Router();
router.route("/").get(checkToken, checkRole("admin"), getDashboardCountDetails);

module.exports = router;
