const { default: mongoose, mongo } = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  hash_password: {
    type: String,
    trim: true,
  },
  addToCard: [
    {
      type: Object,
      trim: true,
    },
  ],
});
UserSchema.methods.authenticate = async function (password) {
  return await bcrypt.compareSync(password, this.hash_password);
};
module.exports = mongoose.model("User", UserSchema);
