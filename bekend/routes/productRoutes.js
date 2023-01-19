const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  creatProductReview,
  getProducyReviews,
  deleteReviews,
  getAdminProducts,
} = require("../controller/productcontoller");
const { isAuthenticated, authorizeRole } = require("../middleware/auth");

const router = express.Router();

//product get
router.route("/products").get(getAllProduct);

//prouct created
router
  .route("/admin/product/new")
  .post(isAuthenticated, authorizeRole("admin"), createProduct);

//update product
router
  .route("/admin/products")
  .get(isAuthenticated, authorizeRole("admin"), getAdminProducts);

router
  .route("/admin/product/:id")
  .put(isAuthenticated, authorizeRole("admin"), updateProduct)
  .delete(isAuthenticated, authorizeRole("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticated, creatProductReview);

router
  .route("/reviews")
  .get(getProducyReviews)
  .delete(isAuthenticated, deleteReviews);
module.exports = router;
