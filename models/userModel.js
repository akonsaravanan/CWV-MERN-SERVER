const mongoose = require("mongoose");

const UserInfo = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleID: { type: String, required: false },
  id: { type: String },
});

const usermodel = mongoose.model("Users", UserInfo);
module.exports = usermodel;
