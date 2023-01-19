const express = require("express");
const {
  registerUser,
  loginuser,
  logout,
  forgotPassword,
  resertPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateuserRole,
  deleteUser,
} = require("../controller/userControler");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginuser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resertPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated, getUserDetails);

router.route("/password/update").put(isAuthenticated, updatePassword);

router.route("/me/update").put(isAuthenticated, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticated, authorizeRole("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRole("admin"), getSingleUser)
  .put(isAuthenticated, authorizeRole("admin"), updateuserRole)
  .delete(isAuthenticated, authorizeRole("admin"), deleteUser);

module.exports = router;
