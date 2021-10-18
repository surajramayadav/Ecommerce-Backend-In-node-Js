const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");

// Create new Order
exports.createOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    data: order,
  });
});

// Get Single Order  --Admin

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

// Get Login user Orders

exports.myOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

// Get All Orders --Admin

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find();

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  let totalAmount = 0;
  order.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    total_Amount: totalAmount,
    data: order,
  });
});

// Update Orders Status --Admin

exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  console.log(order);
  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  order.orderItems.forEach(async (o) => {
    await updateStock(o.product, o.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status == "Delivered") {
    order.deliveredAt = Date.now();
  }

  order = await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: order,
  });
});

// Delete Orders --Admin

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted Successfully",
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}
