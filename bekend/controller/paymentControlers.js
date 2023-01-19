const catchAserorr = require("../middleware/catchAsyncErorr");

const Stripe = require("stripe")
const stripe = Stripe('sk_test_51MQ9jMSE6ybkjzEYmPaH6qlhXf733ZwfikBVGrQ91GkPv5BdljVnVMVXwBSil9YvIbrgtmbmWIyNFrh8Ff602kih00mOOTxaMF');

exports.processPayment = catchAserorr(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "Ecommerce",
      },
    });
  
    res
      .status(200)
      .json({ success: true, client_secret: myPayment.client_secret });
  });
  
  exports.sendStripeApiKey = catchAserorr(async (req, res, next) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
  });