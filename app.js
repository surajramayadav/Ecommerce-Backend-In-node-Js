const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const bodyParser = require('body-parser')
const fileUpload=require('express-fileupload')
//routes imports

const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload());
app.use(express.static(__dirname + '/uploads'));


app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

// Middleware For error
app.use(errorMiddleware);

module.exports = app;
