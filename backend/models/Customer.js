const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
    },
    shop: {
      type: Array,
      required: true,
    },
    orders: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
