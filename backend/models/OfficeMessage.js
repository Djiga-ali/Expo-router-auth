const mongoose = require("mongoose");

const officeMessageSchema = new mongoose.Schema({
  from: { type: Object },
  socketid: { type: String },
  time: { type: String },
  date: { type: String },
  to: { type: String },
  attached: [String],
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, trim: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("OfficeMessage", officeMessageSchema);
