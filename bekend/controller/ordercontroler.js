const Order = require("../model/ordermodel");
const Product = require("../model/productModel");
const Erorrrhandler = require("../utils/erorrhandler");
const catchAserorr = require("../middleware/catchAsyncErorr");

//creat new Order
exports.newOrder = catchAserorr(async (req, res, next) => {
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
    order,
  });
});

//get Single Order
exports.getSingleOrder = catchAserorr(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new Erorrrhandler("Order not found with thisz id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

//get Logged in user Orders
exports.myOrders = catchAserorr(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

//get all orders admin
exports.getAllOrders = catchAserorr(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  
  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//update Order status admin
exports.updateOrder = catchAserorr(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new Erorrrhandler("order not found with this id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(
      new Erorrrhandler("you have Already delivered this order ", 400)
    );
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.delivereAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
}
//delete Order --admin

exports.deleteOrder = catchAserorr(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new Erorrrhandler("order not found with this id", 404));
  }
  await order.remove();

  res.status(200).json({
    success: true,
  });
});
