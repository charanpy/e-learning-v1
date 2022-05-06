const AppError = require('../errors/AppError');
const catchAsync = require('../lib/catchAsync');
const { uploadFileHelper, deleteFile } = require('../lib/s3');
const Material = require('../models/Material.model');

const createMaterial = catchAsync(async (req, res, next) => {
  // prevent file upload if no title
  if (!req.body?.title) return next(new AppError('Title is required', 400));
  if (!req?.file) {
    return next(new AppError('Please Select One File', 400));
  }
  // upload file -pdf or docx with folder name materials
  const file = await uploadFileHelper(req?.file, 'materials');
  if (file) req.body['file'] = file;

  const material = await Material.create(req.body);

  return res.status(201).json(material);
});

const deleteMaterial = catchAsync(async (req, res, next) => {
  const material = await Material.findByIdAndUpdate(
    req.params?.id,
    { isDeleted: true },
    { new: true }
  );

  return res.status(200).json(material);
});

const getMaterial = catchAsync(async (req, res) => {
  const materials = await Material.find({ isDeleted: false });

  return res.status(200).json(materials);
});

const getMaterialByYear = catchAsync(async (req, res, next) => {
  const filters = {
    isDeleted: false,
    preferredYear: req.user?.year,
  };
  const exclude = {};
  if (!req?.query?.restrict) return next(new AppError('Invalid access', 400));
  if (req.query?.restrict === 'public') filters['restrictAccess'] = false;
  if (req.query?.restrict === 'private') filters['restrictAccess'] = true;

  if (filters['restrictAccess']) {
    exclude['file'] = false;
  }
  const materials = await Material.find(filters, exclude);

  return res.status(200).json(materials);
});
module.exports = {
  createMaterial,
  deleteMaterial,
  getMaterial,
  getMaterialByYear,
};
