const app = require("./app");
const dotenv = require("dotenv");
const cloudinary =require('cloudinary')
const { PORT_DEV, DEV, PORT_PRO, CLOUD_NAME, CLOUD_APIKEY, CLOUD_SECRET } = require("./config/config");
// Handing Uncaught Exception

process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// config
dotenv.config({ path: "./config/config.env" });

//Connecting Database
const ConnectDatabase = require("./config/database");
const { Server } = require("http");

ConnectDatabase();


const PORT = DEV ? PORT_DEV : PORT_PRO;
const server = app.listen(PORT, () => {
  console.log(`server is working on http://localhost:${PORT}`);
});

// UnHandled Promise Rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});

