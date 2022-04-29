const AppError = require('../errors/AppError');
const catchAsync = require('../lib/catchAsync');
const { verifyToken } = require('./token');

const checkAuthToken = catchAsync(async (req, res, next) => {
  const token = req?.cookies?.token || req.headers?.authorization;
  if (!token) return next(new AppError('Not authorized', 401));
  const decoded = await verifyToken(token);

  if (!decoded || !decoded?.data)
    return next(new AppError('Not authorized', 401));

  req.user = decoded?.data;

  next();
});

const checkRole = (allowedRole) => {
  return (req, res, next) => {
    if (req?.user?.role === allowedRole) return next();
    return next(new AppError('Not Authorized', 401));
  };
};

module.exports = {
  checkToken: checkAuthToken,
  checkRole,
};
