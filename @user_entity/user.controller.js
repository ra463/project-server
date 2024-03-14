const User = require("./user.model");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

const sendData = async (res, statusCode, user, message) => {
  const token = await user.getJWTToken();

  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    user,
    token,
    message,
  });
};

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user_exist = await User.findOne({
    email: { $regex: new RegExp(email, "i") },
  });

  if (user_exist) return next(new ErrorHandler(`Email already exists`, 400));

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  sendData(res, 201, user, "Registered Successfully");
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("Please enter email and password", 400));

  const user = await User.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  }).select("+password");
  if (!user) return next(new ErrorHandler("Account not found", 401));

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid credentials", 401));


  user.password = undefined;
  sendData(res, 200, user, "Logged in successfully");
});
