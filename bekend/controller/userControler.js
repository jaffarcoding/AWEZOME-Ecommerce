const Erorrrhandler = require("../utils/erorrhandler");
const catchAserorr = require("../middleware/catchAsyncErorr");
const User = require("../model/userModel");
const sendToken = require("../utils/jwttoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//register model
exports.registerUser = catchAserorr(async (req, res, next) => {
  const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });
  sendToken(user, 201, res);
});

//LOGIN USER
exports.loginuser = catchAserorr(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user guven email and password both
  if (!email || !password) {
    return next(new Erorrrhandler("Please Enter Email And Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new Erorrrhandler("Inavalid Email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new Erorrrhandler("invalid email or password", 401));
  }
  sendToken(user, 200, res);
});

//LOGOUT
exports.logout = catchAserorr(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "LogOut",
  });
});

//forgot password
exports.forgotPassword = catchAserorr(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new Erorrrhandler("user Not found", 404));
  }
  //get ResertPassword Token
  const resertToken = user.getResertPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resertPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resertToken}`;

  const message = `your password resert token is ttemp :- \n\n ${resertPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recover",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} succesfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new Erorrrhandler(error.message, 500));
  }
});

//resert password
exports.resertPassword = catchAserorr(async (req, res, next) => {
  //creating token hash
  const resertPasswordtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  //search hashtoken database
  const user = await User.findOne({
    resertPasswordtoken,
    resertPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new Erorrrhandler(
        "Resert password token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new Erorrrhandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//get user Detail
exports.getUserDetails = catchAserorr(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//update user Password
exports.updatePassword = catchAserorr(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new Erorrrhandler("old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new Erorrrhandler("Password does not match", 400));
  }
  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//update user profile
exports.updateProfile = catchAserorr(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageid = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageid);

    const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});

// get all user(admin)
exports.getAllUser = catchAserorr(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//get single user(admin)
exports.getSingleUser = catchAserorr(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new Erorrrhandler(`user does not exist with idL ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//update user Role (admin)
exports.updateuserRole = catchAserorr(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
  });
});

//Delete user admin
exports.deleteUser = catchAserorr(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new Erorrrhandler(`user does not exist with id: ${req.params.id}`,400)
    );
  }

  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
  await user.remove();

  res.status(200).json({
    success: true,
    message: "user Delete Succesfully",
  });
});
