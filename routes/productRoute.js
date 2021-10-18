const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  createProductReview,
  getProductReviews,deleteReview
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/product").get(getAllProducts);

router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router
  .route("/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router
  .route("/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(isAuthenticatedUser, getProductById);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/review").get(isAuthenticatedUser, getProductReviews);

router.route("/review").delete(isAuthenticatedUser, deleteReview);


module.exports = router;
