const Material = require("../../models/Material.model");
const catchAsync = require("../../lib/catchAsync");

const createMaterial = catchAsync(async (req, res, next) => {
  //   console.log(req.body);
  const { title, file, category } = req.body;
  if (!title || !file || !category)
    return next(new AppError("Some Field  is Required", 400));
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
  const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
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
