const express = require("express");
const mongoose = require("mongoose");
const User = require("../model/user");
const Product = require("../model/product");
const router = express.Router();
const bcrypt = require("bcrypt");
router.get("/getuser", (req, res) => {
  User.find({}).exec((error, data) => {
    if (error) res.send("error");
    if (data) res.send(data);
  });
});
router.post("/adduser", (req, res) => {
  const { name, email, password } = req.body;

  const hash_password = bcrypt.hashSync(password, 10);
  const newUser = new User({
    name,
    email,
    hash_password,
  });
  newUser.save((error, user) => {
    if (error) res.status(400).json({ error });
    if (user) {
      res.status(201).json({ user, msg: "Succesfully created.." });
    }
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec(async (error, user) => {
    if (error) res.status(400).json({ error, msg: "something went wrong." });
    if (user) {
      const isAuthenticated = await bcrypt.compare(
        password,
        user.hash_password
      );

      if (isAuthenticated) {
        res.status(200).json({ msg: "Successfully signin...", user });
      } else {
        res.status(400).json({ msg: "incorect password..." });
      }
    } else {
      res.status(400).json({ msg: "user not found..." });
    }
  });
});

router.delete("/deleteuser", (req, res) => {
  const { id } = req.body;
  User.deleteOne({ _id: id }).exec((error, data) => {
    if (error) res.send("error");
    if (data) res.status(200).json({ data, msg: "Successfully deleled!" });
  });
});

router.post("/addtocard", (req, resp) => {
  const { userId, productId } = req.body;
  User.findOneAndUpdate(
    { _id: userId },
    {
      $push: { addToCard: { pID: productId } },
    }
  ).exec((error, data) => {
    if (error) resp.send("Error");
    if (data)
      resp.status(201).json({ data, msg: "successfully added in to card" });
  });
});

router.get("/getUserCard", (req, resp) => {
  const { userId } = req.query;
  console.log("USerID", userId);
  User.findOne({ _id: userId }).exec((error, user) => {
    if (user) {
      if (user.addToCard.length > 0) {
        let prod = [];
        user.addToCard.forEach((element) => {
          Product.findOne({ _id: element.pID }).exec((error, produ) => {
            if (produ) {
              console.log("product", produ);

              prod.push(produ);
            }
          });
        });
        user.products = prod;
        console.log("product", user);
        resp.status(200).json({ user, products: prod });
      }
    } else {
      resp.send("user not found");
    }
  });
  // User.aggregate([
  //   { $match: { _id: userId } },
  //   {
  //     $unwind: { path: "$addToCard" },
  //   },
  //   {
  //     $lookup: {
  //       from: "products",
  //       localField: "addToCard.pID",
  //       foreignField: "_id",
  //       as: "productDetails",
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: "$_id",
  //       name: {
  //         $first: "$name",
  //       },
  //       products: {
  //         $push: { allDetails: "$productDetails" },
  //       },
  //     },
  //   },
  // ]).exec((error, data) => {
  //   if (error) resp.send("error");
  //   if (data) resp.status(200).json({ data, msg: "successfull get cards!" });
  // });

  // User.findOne({ _id: userId }).exec((error, data) => {
  //   User.aggregate([
  //     { $match: { _id: userId } },
  //     // {
  //     // $unwind: "$addToCard",
  //     // },
  //     {
  //       $lookup: {
  //         from: "products",
  //         localField: "addToCard.pID",
  //         foreignField: "_id",
  //         as: "productDetails",
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$_id",
  //         name: {
  //           $first: "$name",
  //         },
  //         products: {
  //           $push: { allDetails: "$productDetails" },
  //         },
  //       },
  //     },
  //   ]).exec((error, data) => {
  //     if (error) resp.send("error");
  //     if (data) resp.status(200).json({ data, msg: "successfull get cards!" });
  //   });
  // });
});

module.exports = router;
