const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const { sendToken, comparePassword } = require("../utils/jwtToken");
const { getResetPasswordToken } = require("../utils/resetPassword");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const { CLOUD_NAME, CLOUD_APIKEY, CLOUD_SECRET } = require("../config/config");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

cloudinary.config({
  cloud_name: CLOUD_NAME,
  cloud_key: CLOUD_APIKEY,
  cloud_secret: CLOUD_SECRET,
});

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const file = req.files.avatar;
  const filename = uuidv4();
  const extension = path.extname(file.name);
  file.mv("./uploads/" + filename + extension, (err) => {
    console.log(err);
  });
  const { name, email, password } = req.body;

  const fullUrl =
    req.protocol + "://" + req.get("host") + "/" + filename + extension;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: filename + extension,
      url: fullUrl,
    },
  });

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await comparePassword(password, user);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = await getResetPasswordToken(user);

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `https://ecommerce-backend-in-node-js.vercel.app/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is : -\n\n ${resetPasswordUrl} \n\n If you have not requested this email then , please ignore it `;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password does not match with Confirm password ", 400)
    );
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Details --user
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Update password --User
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await comparePassword(req.body.oldPassword, user);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword != req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password does not match with Confirm password ", 400)
    );
  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Update Profile --User

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get All User --Admin

exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get Single User --Admin

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exits with id :${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Update User Role  --Admin

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Delete User   --Admin

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  console.log(user);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exits with id :${req.params.id}`, 404)
    );
  }

  user = await user.deleteOne();

  console.log(user);
  res.status(200).json({
    success: true,
    message: "User deleted Successfully",
  });
});
