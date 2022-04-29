const Material = require("../../models/Material.model");
const catchAsync = require("../../lib/catchAsync");
const AppError = require("../../errors/AppError");
const { updateFileHelper, uploadFileHelper } = require("../../lib/s3");
const Course = require("../../models/Course.model");

const createMaterial = catchAsync(async (req, res, next) => {
  // if (!req?.file) return next(new AppError('File is required'));

  const { title, course } = req.body;
  if (!title || !course)
    return next(new AppError("Some Field  is Required", 400));

  const isCourse = await Course.findById(course);

  if (!isCourse) return next(new AppError("No Course found", 404));

  // const file = await uploadFileHelper(req?.file, 'video-materials');
  // if (file) req.body['file'] = file;

  const material = await Material.create(req.body);
  return res.status(201).json(material);
});

const getMaterial = catchAsync(async (req, res, next) => {
  const materials = await Material.find({
    isDeleted: false,
    course: req.params.id,
  });

  return res.status(200).json(materials);
});

const updateMaterial = catchAsync(async (req, res, next) => {
  const material = await Material.findById(req.params?.id);

  if (!material) return next(new AppError("No Material Found", 404));

  // const file = await updateFileHelper(
  //   req?.file,
  //   material?.file?.key,
  //   'video-material'
  // );
  // if (file) req.body['file'] = file;

  for (let field in req.body) {
    material[field] = req.body[field];
  }

  await material.save();

  return res.status(200).json(material);
});

const deleteMaterial = catchAsync(async (req, res, next) => {
  const material = await Material.findByIdAndUpdate(
    req.params?.id,
    { isDeleted: true },
    { new: true }
  );

  return res.status(200).json(material);
});

module.exports = {
  createMaterial,
  getMaterial,
  updateMaterial,
  deleteMaterial,
};
