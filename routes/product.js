const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const path = require("path");
const Product = require("../model/product");
//fot image
const multer = require("multer");

// middileware for imageUpload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
// middile ware for imageUpload  End

router.post("/addProduct", upload.single("productImage"), (req, resp) => {
  const { name, brand, category, price } = req.body;
  const newProduct = new Product({
    name,
    brand,
    category,
    price,
    productImage: req.file.path,
  });
  newProduct.save((error, product) => {
    if (error) resp.status(400).json({ error });
    if (product) {
      resp.status(201).json({ product, msg: "Successfully created.." });
    }
  });
});

router.get("/products", (req, resp) => {
  Product.find().exec((error, data) => {
    if (error) resp.send({ error });
    if (data) resp.send(data);
  });
});

router.delete("/deleteProduct", (req, resp) => {
  const { id } = req.body;
  Product.deleteOne({ _id: id }).exec((error, data) => {
    if (error) resp.send({ error });
    if (data) resp.status(200).json({ data, msg: "Successfully deleted!" });
  });
});

module.exports = router;
