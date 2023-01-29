const app = require("./app");

const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

const connectDatabase = require("./config/database");


//handling uncaught rejection
process.on("uncaughtException", (err) => {
  console.log(`error: ${err.message}`);
  console.log(`shutting down sever due to uncauth exception`);
  process.exit(1);
});


// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "bekend/config/config.env" });
}

connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
const server = app.listen(process.env.PORT, () => {
  console.log(`server is starting on http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`err: ${err.massage}`);
  console.log(`sutting down the server due to to handule`);
  server.close(() => {
    process.exit();
  });
});
