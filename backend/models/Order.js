const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cart: {
      type: Array,
      required: true,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    transfer:{
      type: Object,
    },
    paymentIntent:{
      type: Object,
    },
    // user: {
    //   type: Object,
    //   required: true,
    // },
    shop:{
      type: Object,
      // required: true,
    },
    totalPrice: {
      type: Number,
      // required: true,
    },
    stripeTotalTransferedAmount: {
      type: Number,
      // required: true,
    },
    status: {
      type: String,
      default: "Processing",
    },
    paymentInfo: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
      type: {
        type: String,
      },
    },
    paidAt: {
      type: Date,
      default: Date.now(),
    },
    deliveredAt: {
      type: Date,
    },
    //   custom ideal
    //   delivery company
    //   deliveredBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Deliver",
    //   },
    //   custom ideal
    deliveredBy: {
      type: Object,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
