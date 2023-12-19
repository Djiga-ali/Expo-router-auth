const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
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
    slug: {
      type: String,
      //   required: true,
      unique: true,
    },

    price: {
      type: Number,
      trim: true,
      //   required: [true, "Product must have a price"],
      maxlength: 32,
    },
    quantity: {
      type: Number,
      trim: true,
      //   required: [true, "Product must have a price"],
      maxlength: 32,
    },
    soldOutQty: {
      type: Number,
      trim: true,
      //   required: [true, "Product must have a price"],
      maxlength: 32,
    },
    soldOutCanceled: {
      type: Number,
      trim: true,
      //   required: [true, "Product must have a price"],
      maxlength: 32,
    },
    soldOutRefund: {
      type: Number,
      trim: true,
      //   required: [true, "Product must have a price"],
      maxlength: 32,
    },
    lostProductQty: {
      totalQty: {
        type: Number,
        trim: true,
        maxlength: 32,
      },
      qty: { type: Number, trim: true, maxlength: 32 },
      reason: {
        type: String,
      },
      //   required: [true, "Product must have a price"],
    },
    expiredProductQty: {
      type: Number,
      trim: true,
      //   required: [true, "Product must have a price"],
      maxlength: 32,
    },
    //NB: Proposition à repenser  ou créer un model de gestion de magasin ou produits:
    // 1. modifier la quantité du stock pour motif produits abimés et nombre des produits abimés
    // 1. modifier la quantité du stock pour motif produits périmés et nombre des produits périmés
    // 1. modifier la quantité du stock pour motif produits volés et nombre des produits volés
    // 1. modifier la quantité du stock pour motif produits vendus et nombre des produits vendus
    // 1. modifier la quantité du stock pour motif produits hors serive et nombre des produits hors serive ...
    // 1.  etc.

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
    // A AJOUTER ********************
    madeInBdi: {
      type: Boolean,
      default: false,
      //   required: [true, "Product must belong to a category"],
    },
    madeInKy: {
      type: Boolean,
      default: false,
      //   required: [true, "Product must belong to a category"],
    },
    madeInRdc: {
      type: Boolean,
      default: false,
      //   required: [true, "Product must belong to a category"],
    },
    madeInRwd: {
      type: Boolean,
      default: false,
      //   required: [true, "Product must belong to a category"],
    },
    madeInTz: {
      type: Boolean,
      default: false,
      //   required: [true, "Product must belong to a category"],
    },
    madeInUgd: {
      type: Boolean,
      default: false,
      //   required: [true, "Product must belong to a category"],
    },
    madeInSudan: {
      type: Boolean,
      default: false,
      //   required: [true, "Product must belong to a category"],
    },

    productStatus: {
      type: String,
      default: "active",
    },
    // physical or digital or service
    productType: {
      type: String,
      default: "",
    },

    // new or used
    productState: {
      type: String,
      default: "",
    },
    // usedProduct: {
    //   type: Boolean,
    //   default: false,
    // },

    productLanguage: {
      type: String,
      default: "",
    },
    productCountry: {
      type: String,
      default: "",
    },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      // required: true,
    },
    sponsored: {
      type: Boolean,
      default: false,
      //   required: [true, "Product must belong to a category"],
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
