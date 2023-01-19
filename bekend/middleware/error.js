const Errorhandler = require("../utils/erorrhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal Server Working Erorr";

  //wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource not found, invalid: ${err.path}`;
    err = new Errorhandler(message, 404);
  }

  //mongose dublicate key erorr
  if (err.code == 11000) {
    const message = `duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new Errorhandler(message, 400);
  }
  //wrong JWT error
  if (err.name === "jsonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    err = new Errorhandler(message, 400);
  }

  //jwt expire error
  if (err.name === "TokenExpireError") {
    const message = `Json web token is expire, try again`;
    err = new Errorhandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
