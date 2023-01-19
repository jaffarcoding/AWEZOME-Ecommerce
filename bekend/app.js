const express = require("express");
const erorrmiddleware = require("./middleware/Error");
const cookie = require("cookie-parser");
const bodyparser = require("body-parser");
const fileupload = require("express-fileupload");
const errorMiddleware = require("./middleware/error");
const app = express();
const path = require('path');

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());
app.use(cookie());
app.use(bodyparser.urlencoded({extended : true}));
app.use(fileupload());
//routes import 

const product = require("./routes/productRoutes");
const user = require("./routes/userRoute");
const Order = require("./routes/orderRoute");
const payment = require("./routes/paymentroute");


app.use("/api/v1", product);
app.use("/api/v1",user);
app.use("/api/v1", Order);
app.use("/api/v1", payment);


app.use(express.static(path.join(__dirname,"../frontend/build")));

app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"));
})
//middleware for erorr
app.use(errorMiddleware)

module.exports = app;