const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const sponsoredSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      //   required: [true, "Please add a product Name"],
      maxlength: 32,
    },

    description: {
      type: String,
      trim: true,
      //   required: [true, "Please add a product Description"],
      maxlength: 2000,
    },

    price: {
      type: Number,
      trim: true,
      //   required: [true, "Product must have a price"],
      maxlength: 32,
    },

    // images: [
    pictures: [
      {
        public_id: {
          type: String,
          //   required: true,
        },
        url: {
          type: String,
          //   required: true,
        },
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      //   required: [true, "Product must belong to a category"],
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Sponsored", sponsoredSchema);
