const Video = require("../../models/Videos.model");
const catchAsync = require("../../lib/catchAsync");
const { uploadFileHelper, getSignedUrl } = require("../../lib/s3");

// creating video
const createVideo = catchAsync(async (req, res) => {
  if (req.file) {
    const videoTumbnail = await uploadFileHelper(req?.file, "videoTumbnail");
    if (videoTumbnail) {
      req.body["videoTumbnail"] = videoTumbnail;
    }
  }
  const doc = await Video.create(req.body);
  return res.status(201).json(doc);
});

// get videos
const getVideos = catchAsync(async (req, res) => {
  const videos = await Video.find({ isDeleted: false }).sort({ priority: 1 });
  return res.status(200).json(videos);
});

// get videos by id
const getVideoById = catchAsync(async (req, res) => {
  const video = await Video.findOne({ id: req.params.id });
  return res.status(200).json(video);
});

// get deleted videos
const getDeletedVideos = catchAsync(async (req, res) => {
  const videos = await Video.find({ isDeleted: true });
  return res.status(200).json(videos);
});

// delete video
const deleteVideo = catchAsync(async (req, res) => {
  const video = await Video.findOneAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );
});

const getVideoUploadUrl = catchAsync(async (req, res) => {
  const { fileName, fileType } = req.body;

  const url = await getSignedUrl(`video/${fileName}`, fileType);

  return res.status(200).json({ url });
});

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  deleteVideo,
  getDeletedVideos,
  getVideoUploadUrl,
};
