const AppError = require('./AppError');

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data ${errors.join('.')}`;
  return new AppError(message, 400);
};

const handleFileLimitError = () => {
  return new AppError('File too large', 400);
};

const handleCastErrorDb = (err) => {
  const message =
    `Invalid ${err.path} : ${err.value}.` +
    'The requested data is not available';
  return new AppError(message, 400);
};

const handleDuplicateFieldErrorDb = (err) => {
  console.log('handle');
  const keyField = Object.keys(err.keyValue)[0];
  return new AppError(`Please use different ${keyField}`, 400);
};

const handleJwtTokenExpire = () => {
  return new AppError('Token has been expired!.Please register again', 401);
};

const handleMulterError = () => {
  return new AppError('Please select only one image', 400);
};

const handleWebTokenError = () => {
  return new AppError('Invalid Token.Please register again', 400);
};

const sendError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const errorController = (err, req, res, next) => {
  console.log(err, err?.name);
  err.statusCode = err.statusCode || 500;

  err.status = err.status || 'error';

  let error = { ...err, message: err.message, name: err?.name };

  if (error.name === 'ValidationError') {
    error = handleValidationError(err);
  }
  if (error.name === 'TokenExpiredError') {
    error = handleJwtTokenExpire();
  }
  if (error.code === 11000) {
    error = handleDuplicateFieldErrorDb(error);
  }
  if (error.name === 'CastError' || error.kind === 'ObjectId')
    error = handleCastErrorDb(error);

  if (error.name === 'MulterError' && error.code === 'LIMIT_UNEXPECTED_FILE')
    error = handleMulterError();

  if (error.name === 'MulterError' && error.code === 'LIMIT_FILE_SIZE')
    error = handleFileLimitError();

  if (error.code === 'IMAGES_ONLY')
    error = new AppError('Please select valid file', 400);

  if (error.name === 'JsonWebTokenError') error = handleWebTokenError();

  sendError(error, res);
};

module.exports = errorController;
