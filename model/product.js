const { default: mongoose, mongo } = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  brand: {
    type: String,
    require: true,
    trim: true,
  },
  category: {
    type: String,
    require: true,
    trim: true,
  },
  price: {
    type: Number,
    require: true,
    trim: true,
  },
  productImage: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
