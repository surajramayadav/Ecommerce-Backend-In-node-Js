const express = require("express");
const { createOrder, getSingleOrder, myOrder, getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser,createOrder);

router.route("/order/:id").get(isAuthenticatedUser,authorizeRoles('admin'),getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser,myOrder);

router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles('admin'),getAllOrders);

router.route("/admin/orders/:id").put(isAuthenticatedUser,authorizeRoles('admin'),updateOrderStatus);

router.route("/admin/orders/:id").delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder);









module.exports = router;