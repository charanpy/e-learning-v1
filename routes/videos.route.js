const express = require("express");
const {
  createVideo,
  getVideos,
  getVideoById,
  getDeletedVideos,
  deleteVideo,
} = require("../controllers/video");

const router = express.Router();
const { upload } = require("../lib/multer");

router.route("/").post(upload().single("video"), createVideo);
router.route("/").get(getVideos);
router.route("/:id").get(getVideoById).delete(deleteVideo);
router.route("/deleted").get(getDeletedVideos);

module.exports = router;
