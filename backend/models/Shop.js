const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const shopSchema = new mongoose.Schema(
  {
    // min/max is for Number and Date. For string, it's minLength/maxLength
    shopName: { type: String, maxLength: 255, required: true, unique: true },
    address: { type: String, maxLength: 255 },
    country: {
      type: String,
    },
    state: {
      type: String,
      maxLength: 255,
    },
    city: {
      type: String,
      maxLength: 255,
    },
    // Shop profile ou logo image
    shopLogo: {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
    // Shop banner ou logo image
    shopBanner: {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },
    // commerce de détail ou commerce de gros
    // retail_business or wholesale
    shopType: {
      type: String,
      default: "",
    },
    shopMainActivity: {
      type: String,
      default: "",
    },
    shopTypeName: {
      type: String,
    },
    shopLanguge: {
      type: String,
      default: "",
    },
    privateShop: { type: Boolean, default: false },
    // A AJOUTER ****************************
    // active or suspended, privateShop
    shopStatus: {
      type: String,
      default: "active",
    },

    ownerEmail: {
      type: String,
    },
    ownerPhone: {
      type: String,
    },
    businessEmail: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    businessPhone: { type: String, default: "" },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sold: { type: Boolean, default: false },

    mainActivity: {
      type: String,
    },
    shopViews: {
      type: Number,
      default: 0,
    },

    // Stripe
    stripe_account_id: {
      type: String,
      default: "",
    },
    stripe_seller: {},
    stripeSession: {},
  },

  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);
