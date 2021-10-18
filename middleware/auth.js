const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/config");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401))
    }

    const decodedData = jwt.verify(token, JWT_SECRET)

    req.user = await User.findById(decodedData.id)

    // console.log(req.user)

    next()
})

exports.authorizeRoles = (...roles) => {
    return catchAsyncErrors(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403))
        }

        next()
    })
}