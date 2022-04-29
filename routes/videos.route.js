const express = require('express');
const {
  createVideo,
  getVideos,
  getVideoById,
  getDeletedVideos,
  deleteVideo,
  getVideoUploadUrl,
  getVideoForCourse,
} = require('../controllers/video');

const router = express.Router();
const { upload } = require('../lib/multer');
const { checkToken } = require('../services/auth');

router.route('/').post(upload().single('videoThumbnail'), createVideo);
router.route('/course/:courseId').get(checkToken, getVideoForCourse);
router.route('/upload').post(getVideoUploadUrl);
router.route('/').get(getVideos);
router.route('/:id').get(getVideoById).delete(deleteVideo);
router.route('/deleted').get(getDeletedVideos);

module.exports = router;
