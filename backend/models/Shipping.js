const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({});

module.exports = mongoose.model("Shipping", shippingSchema);
