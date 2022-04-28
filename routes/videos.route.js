const express = require('express');
const {
  createVideo,
  getVideos,
  getVideoById,
  getDeletedVideos,
  deleteVideo,
  getVideoUploadUrl,
} = require('../controllers/video');

const router = express.Router();
const { upload } = require('../lib/multer');

router.route('/').post(upload().single('videoThumbnail'), createVideo);
router.route('/upload').post(getVideoUploadUrl);
router.route('/').get(getVideos);
router.route('/:id').get(getVideoById).delete(deleteVideo);
router.route('/deleted').get(getDeletedVideos);

module.exports = router;
