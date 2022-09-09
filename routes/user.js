const express = require("express");
const mongoose = require("mongoose");
const User = require("../model/user");
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
      res.status(201).json({ user, msg: "user Created Succesfully." });
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
        res.status(200).json({ msg: "signin successfully...", user });
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

module.exports = router;
