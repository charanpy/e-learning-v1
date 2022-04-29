const Video = require('../../models/Videos.model');
const AppError = require('../../errors/AppError');
const catchAsync = require('../../lib/catchAsync');
const EnrolCourse = require('../../models/EnrolCourse.model');
const { uuid } = require('uuidv4');
const { uploadFileHelper, getSignedUrl } = require('../../lib/s3');

const getVideoForCourse = catchAsync(async (req, res, next) => {
  const isEnrolled = await EnrolCourse({
    course: req.params?.courseId,
    user: req?.user?.id,
    access: true,
  });

  if (!isEnrolled) return next(new AppError('Unauthorized', 401));

  const videos = await Video.find({ course: req.params?.courseId });

  return res.status(200).json(videos);
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
  const video = await Video.findOneAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );
});

const acceptedFolder = ['course', 'materials'];
const getVideoUploadUrl = catchAsync(async (req, res, next) => {
  const { fileName, fileType, folder } = req.body;
  if (!acceptedFolder.includes(folder) || !fileName || !fileType)
    return next(new AppError('Invalid folder path', 400));

  const fileExtension = fileName?.split('.')?.pop();
  const name = fileName?.slice(0, fileName?.lastIndexOf('.'));
  const key = `${name || ''}${uuid()}${fileExtension}`;

  const url = await getSignedUrl(`${folder}/${fileName}`, fileType);

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
