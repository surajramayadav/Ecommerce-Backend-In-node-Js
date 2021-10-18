const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const Apifeatures = require("../utils/apifeatures");
const { REDIS_EXPIRE } = require("../config/config");
const redis = require("redis");
const client = redis.createClient();

client.on("error", function (error) {
  console.error(error);
});
//Create Product --admin

exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    data: product,
  });
});

//Get All Product

exports.getAllProducts = catchAsyncError(async (req, res) => {
  const ProductCount = await Product.countDocuments();
  const resultPerPage = 10;
  // get data in redis
  client.get("getAllProducts", async function (err, data) {
    if (err) {
      return next(new ErrorHandler("Product not found", 404));
    }
    if (data) {
      console.log("data comes from redis");
      res.status(200).json({
        success: true,
        data: JSON.parse(data),
        ProductCount,
      });
    } else {
      const apiFeature = new Apifeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);

      const product = await apiFeature.query;

      //set data in redis
      client.setex("getAllProducts", REDIS_EXPIRE, JSON.stringify(product));
      console.log("data comes from mongo");

      res.status(200).json({
        success: true,
        data: product,
        ProductCount,
      });
    }
  });
});

// Update Product  --Admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

//Delete Product --Admin

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  product = await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted Successfully",
  });
});

// Get Product BY Id

exports.getProductById = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// Create new Reviews or Update the Review

exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviwes.find(
    (rev) => rev.user.toString() == req.user._id.toString()
  );
  if (isReviewed) {
    product.reviwes.forEach((rev) => {
      if (rev.user.toString() == req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviwes.push(review);
    product.numOfReviews = product.reviwes.length;
  }

  let avg = 0;
  product.reviwes.forEach((rev) => {
    avg = avg + rev.rating;
  });

  product.ratings = avg / product.reviwes.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: product,
  });
});

// Get All Reviews of a product

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    data: product.reviwes,
  });
});

//  Delete Reviews of a product

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviwes.filter(
    (rev) => rev._id.toString() != req.query.id.toString()
  );

  let avg = 0;
  if (reviews.length != 0) {
    reviews.forEach((rev) => {
      avg = avg + rev.rating;
    });
  }

  const ratings = reviews.length != 0 ? avg / reviews.length : avg;

  const numOfReviews = reviews.length;

  product = await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    data: product,
  });
});
