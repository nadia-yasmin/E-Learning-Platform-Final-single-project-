const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email must be given"],
    },
    name: {
      type: String,
      required: [true, "name must be given"],
    },
    userblocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      required: [true, "role must be given"],
    },
  },
  { timestamps: true }
);
const adminModel = mongoose.model("admins", adminSchema);

module.exports = adminModel;
