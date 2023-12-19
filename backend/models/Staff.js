const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    staffInfo: {
      type: Object,
    },
    job: {
      type: String,
    },
    officeMessages: {
      type: Object,
      default: {},
    },
    jobPosition: {
      type: String,
      default: "Employee",
    },
    // active, suspended, fired
    status: {
      type: String,
      default: "active",
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
