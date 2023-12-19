const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "Please enter your event product name!"],
    },
    desc: {
      type: String,
      // required: [true, "Please enter your event product name!"],
    },
    country: {
      type: String,
      // required: [true, "Please enter your event product name!"],
    },
    state: {
      type: String,
      // required: [true, "Please enter your event product name!"],
    },
    type: {
      type: String,
      // required: [true, "Please enter your event product name!"],
    },
    productState: { type: String },
    productType: { type: String },
    price: {
      type: Number,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
