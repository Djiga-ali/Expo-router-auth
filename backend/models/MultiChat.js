const mongoose = require("mongoose");

const multichatModel = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    isStaffChat: { type: Boolean, default: false },
    isShopChat: { type: Boolean, default: false },
    isSMultiChat: { type: Boolean, default: false },
    chatStatus: { type: String, default: "active" },
    blocker: { type: String, default: "" },
    blocked: { type: String, default: "" },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    staffMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
    staffAndUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shopOwners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    staffGroupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    // group profile image
    goupAvatar: {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MultiChat", multichatModel);
