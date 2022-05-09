const express = require("express");
const { getOrders } = require("../controllers/order");

const router = express.Router();
const { checkRole, checkToken } = require('../services/auth');

router.route("/").get(checkToken, checkRole("admin"), getOrders);

module.exports = router;
