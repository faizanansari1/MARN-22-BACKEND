const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");

mongoose.connect("mongodb://localhost:27017/e-com").then(() => {
  console.log("succesfully connected");
});

app.use(cors());
app.use(express.json());
app.use("/user", userRoute);
app.use(productRoute);

app.use("/uploads", express.static("uploads"));
global.__basdir = __dirname;
app.listen(5000, () => {
  console.log("server running on port 5000");
});
