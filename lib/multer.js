const multer = require('multer');
const path = require('path');

function checkFileType(file, cb, fileType) {
  const filetypes = fileType === 'image' ? /jpeg|jpg|png|webp/ : /pdf|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    // custom error
    cb(new multer.MulterError('IMAGES_ONLY'));
  }
}

const upload = (fileType = 'image') =>
  multer({
    dest: 'uploads',
    // fileFilter: function (req, file, cb) {
    //   checkFileType(file, cb, fileType);
    // },
    // limits: { fileSize: fileType === 'image' ? 1000000 : 3000000 },
  });

const getFileExtension = (file) => file?.originalname?.split('.')?.pop();

module.exports = {
  upload,
  getFileExtension,
};
