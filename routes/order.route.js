const express = require("express");
const {
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/order");

const router = express.Router();
const { checkRole, checkToken } = require("../services/auth");

router.route("/").get(checkToken, checkRole("admin"), getOrders);
router
  .route("/:id")
  .get(checkToken, checkRole("admin"), getOrderById)
  .put(checkToken, checkRole("admin"), updateOrderStatus);

module.exports = router;
