const Product = require("./product.model");
const User = require("../@user_entity/user.model");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const { sendInvoice } = require("../utils/sendPdf");

exports.createProduct = catchAsyncError(async (req, res, next) => {
  const { product_array } = req.body;
  if (!product_array) return next(new ErrorHandler("Please add product", 400));

  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("Please Login First", 404));

  product_array.forEach(async (product) => {
    if (product.qty === 0 || product.rate === 0)
      return next(new ErrorHandler("Please add qty and rate", 400));
    await Product.create({
      user: req.userId,
      name: product.name,
      qty: product.qty,
      rate: product.rate,
      total: product.rate * product.qty,
    });
  });

  const invoice = await sendInvoice(product_array);

  res.status(201).json({
    success: true,
    message: "Product Created Successfully",
    invoice,
  });
});

exports.getallProduct = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("Please Login First", 404));

  const products = await Product.find().populate("user", "name");

  res.status(200).json({
    success: true,
    products,
  });
});
