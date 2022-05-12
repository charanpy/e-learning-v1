const Video = require('../../models/Videos.model');
const AppError = require('../../errors/AppError');
const catchAsync = require('../../lib/catchAsync');
const EnrolCourse = require('../../models/EnrolCourse.model');
const { uuid } = require('uuidv4');
const { uploadFileHelper, getSignedUrl, deleteFile } = require('../../lib/s3');
const Material = require('../../models/Material.model');

const getVideoForCourse = catchAsync(async (req, res, next) => {
  const isEnrolled = await EnrolCourse.findOne({
    course: req.params?.courseId,
    user: req?.user?.id,
    access: true,
  });

  if (!isEnrolled) return next(new AppError('Unauthorized', 401));

  const videos = await Video.find({ course: req.params?.courseId });
  console.log(videos);
  const materials = await Material.find({ course: req.params?.courseId });
  return res.status(200).json({ videos, materials });
});

// creating video
const createVideo = catchAsync(async (req, res) => {
  console.log(req.file, 'request file', req.body);
  if (req.file) {
    const videoThumbnail = await uploadFileHelper(req?.file, 'videoThumbnail');
    if (videoThumbnail) {
      req.body['videoThumbnail'] = videoThumbnail;
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
  const video = await Video.findOneAn(req.params.id);

  if (!video) return next(new AppError('Video not found', 404));
  await deleteFile(video?.video?.key);

  await video.remove();

  return res.status(200).json('Deleted video');
});

const acceptedFolder = ['video', 'materials'];
const getVideoUploadUrl = catchAsync(async (req, res, next) => {
  const { fileName, fileType, folder } = req.body;
  // if (!acceptedFolder.includes(folder) || !fileName || !fileType)
  //   return next(new AppError("Invalid folder path", 400));

  const fileExtension = fileName?.split('.')?.pop();
  const name = fileName?.slice(0, fileName?.lastIndexOf('.'));
  const key = `${folder}/${name || ''}${uuid()}.${fileExtension}`;

  const url = await getSignedUrl(key, fileType);

  return res.status(200).json({ key, url });
});

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  deleteVideo,
  getDeletedVideos,
  getVideoUploadUrl,
  getVideoForCourse,
};
