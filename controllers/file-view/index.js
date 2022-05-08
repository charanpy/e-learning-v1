const AppError = require('../../errors/AppError');
const catchAsync = require('../../lib/catchAsync');
const FileView = require('../../models/FileView.model');
const Material = require('../../models/LibMaterial.model');

const getFileAccess = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // check student already accessed
  const isFileAccessed = await FileView.findOne({
    material: id,
    student: req?.user?.id,
  });

  // get material and check if it has restriction
  const material = await Material.findById(id);
  if (isFileAccessed) return res.status(200).json(material);
  console.log(material, id);
  // if no restriction send material
  if (!material?.restrictAccess) return res.status(200).json(material);

  // get no of student accessed
  const fileView = await FileView.find({ material: id });

  console.log(
    fileView,
    'file',
    material.restrictCount,
    fileView >= material.restrictCount
  );

  // check restrict count
  if (fileView.length >= material.restrictCount)
    return next(new AppError('Maximum view count reached', 400));

  // create an entry of material and student
  await FileView.create({ material: id, student: req?.user?.id });

  return res.status(200).json(material);
});

module.exports = {
  getFileAccess,
};
