const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: [true, "Email already exists"],
      validate: [validator.isEmail, "Please enter valid email address"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [8, "Password must be atleast 8 characters"],
      trim: true,
      select: false,
    },
    invoice: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

schema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

schema.methods.getJWTToken = async function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", schema);
