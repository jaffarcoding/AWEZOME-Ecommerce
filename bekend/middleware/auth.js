const Erorrrhandler = require("../utils/erorrhandler");
const catchAserorr = require("./catchAsyncErorr");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

exports.isAuthenticated = catchAserorr(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new Erorrrhandler("please login to access this resources", 401)
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Erorrrhandler(
          `role: ${req.user.role} is not allowed to acces this resources`,
          403
        )
      );
    }
    next();
  };
};
