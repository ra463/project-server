const express = require("express");
const { auth } = require("../middlewares/auth");
const { createProduct, getallProduct } = require("./product.controller");

const router = express.Router();

router.post("/add-product", auth, createProduct);
router.get("/get-all-product", auth, getallProduct);

module.exports = router;
