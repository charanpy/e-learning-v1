const PasswordServe = require('../../services/password');
const otpGenerator = require('otp-generator');
const Admin = require('../../models/Admin.model');
const catchAsync = require('../../lib/catchAsync');
const { sendEmail } = require('../../services/email');
const { generate } = require('../../services/token');
const { verify } = require('../../services/password');
// creating admin
const createAdmin = catchAsync(async (req, res, next) => {
  const filters = {
    $or: [
      {
        mobileNumber: req.body.mobileNumber,
      },
      {
        email: req.body.email,
      },
    ],
  };

  // default password
  const defaultPassword = otpGenerator.generate(8, {
    upperCase: true,
    alphabets: true,
    specialChars: true,
  });
  req.body.password = defaultPassword;

  // checking filters
  const doc = await Admin.findOne(filters);
  if (doc) {
    return res
      .status(400)
      .json({ message: 'Mobile Number OR Email Is Already Exist' });
  }
  // hashing password
  req.body.password = await PasswordServe.hash(req.body.password);
  const data = await Admin.create(req.body);
  const email = await sendEmail(
    req.body.email,
    { password: defaultPassword },
    'password'
  );
  console.log(email);
  return res.status(201).json(data);
});

// update Admin

const updateAdmin = catchAsync(async (req, res, next) => {
  const updateData = await Admin.findOneAndUpdate(
    {
      id: req.body.id,
      isDeleted: false,
    },
    req.body,
    { new: true }
  );
  return res.status(400).json('Updated Successfully');
});

//   get admins
const getAdmins = catchAsync(async (req, res, next) => {
  const result = await Admin.find({}, { password: false });
  if (!result) {
    return res.status(400).json({ message: 'Details not found' });
  }
  return res.json(result);
});

const deleteAdmin = catchAsync(async (req, res, next) => {
  const result = await Admin.find({}, { password: false });
  if (result.length <= 1) {
    return res.status(400).json({ message: 'Fail to delete' });
  }
  const doc = await Admin.findByIdAndDelete(req.params.id);
  return res.json('Admin deleted');
});

// update password
const updatePassword = catchAsync(async (req, res) => {
  const admin = await Admin.findOne({
    id: req.params.id,
  });
  // checking password
  if (!admin) {
    console.error('Admin not found');
    return res.status(400).json({ message: 'Invalid Details' });
  }

  //  checking password
  const isPasswordMatch = await PasswordServe.verify(
    req.body.oldPassword,
    admin.password
  );

  if (!isPasswordMatch) {
    console.error('password wrong');
    return res.status(400).json({ message: 'Incorrect Password' });
  }

  req.body.newPassword = await PasswordServe.hash(req.body.newPassword);

  const result = await Admin.findOneAndUpdate(
    // checking user
    {
      id: req.params.id,
    },
    { password: req.body.newPassword },
    { new: true }
  );
  return res.json({ message: 'password updated successfully' });
});

const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Invalid credentials', 400));

  const admin = await Admin.findOne({ email });

  if (!admin) return next(new AppError('Invalid credentials', 400));

  if (!(await verify(password, admin.password)))
    return next(new AppError('Invalid credentials', 400));

  const token = await generate({ id: admin._id, role: 'admin' });

  return res.status(200).json({ user: admin, token });
});

const getMe = catchAsync(async (req, res, next) => {
  const user = await Admin.findOne({
    _id: req?.user?.id,
    isDeleted: false,
  });
  if (!user) return next(new AppError('Not Authorized', 401));

  return res.status(200).json(user);
});

module.exports = {
  createAdmin,
  updateAdmin,
  getAdmins,
  deleteAdmin,
  updatePassword,
  adminLogin,
  getMe,
};
