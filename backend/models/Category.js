const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      //   required: [true, "Please add a category Name"],
    },
    value: {
      type: String,
      trim: true,
      //   required: [true, "Please add a category Name"],
    },
    slug: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
