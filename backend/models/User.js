const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      maxLength: 256,
    },
    age: { type: Number },
    genre: { type: String, default: "" },
    // genreName: { type: String, default: "" },
    country: { type: String, default: "" },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    village: { type: String }, //zone localité
    address: { type: String },
    countryPrefex: { type: Number },
    phone: { type: String },

    userShopName: {
      type: String,
      default: "",
    },
    userShopType: {
      type: String,
      default: "",
    },
    userShopActivity: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "NoTSeller",
    },
    profileImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      },
    },
    status: {
      type: String,
      default: "FreeTrial",
      // suspended
    },
    language: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isLoggin: {
      type: Boolean,
      default: false,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },

    bio: {
      type: String,
      default: "votre bio",
    },

    // Chat
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    status: {
      type: String,
      default: "online",
    },
    officeMessages: {
      type: Object,
      default: {},
    },
  },

  { timestamps: true }
);

// Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  // si le mot de pass n'a été modifié ou crypté, le processus continue quand même
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

module.exports = mongoose.model("User", userSchema);
