const express = require("express");
const {
  createMaterial,
  getMaterial,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/material");

const router = express.Router();

router.route("/").post(createMaterial);
router
  .route("/:id")
  .get(getMaterial)
  .put(updateMaterial)
  .delete(deleteMaterial);

module.exports = router;
