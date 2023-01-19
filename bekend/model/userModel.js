const mongoose = require("mongoose");
const validator = require("validator");
const bcrupt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please Enter Your Name"],
    maxLength: [30, "Name Cannot exceed 30 character"],
    minLength: [4, "Name should have more then 4 charactrer"],
  },
  email: {
    type: String,
    required: [true, "please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please Enter Your Password"],
    minlength: [8, "password should be greater then 8 character"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrupt.hash(this.password, 10);
});

//JWT TOKEN
userSchema.methods.getJWTTOKEN = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrupt.compare(enteredPassword, this.password);
};

//Genarating password resert token
userSchema.methods.getResertPasswordToken = function () {
  const resertToken = crypto.randomBytes(20).toString("hex");

  //hashing and adding resertpaswordtoken to  usershema
  this.resertPasswordtoken = crypto
    .createHash("sha256")
    .update(resertToken)
    .digest("hex");

  this.resertPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resertToken;
};
module.exports = mongoose.model("User", userSchema);
