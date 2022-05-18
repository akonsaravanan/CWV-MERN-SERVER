const mongoose = require("mongoose");

const tourmodel = mongoose.Schema(
  {
    title: String,
    description: String,
    name: String,
    creator: String,
    tags: [String],
    likes: {
      type: [String],
      default: [],
    },
    imageFile: String,
  },
  { timestamps: true }
);

const tourModel = mongoose.model("Tours", tourmodel);
module.exports = tourModel;
