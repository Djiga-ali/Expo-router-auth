const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    staffSender: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    receiver: { type: String },
    object: { type: String },
    content: { type: String, trim: true },
    productImg: { type: String },
    productName: { type: String },
    productPrice: { type: Number },
    attached: [
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
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "MultiChat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
