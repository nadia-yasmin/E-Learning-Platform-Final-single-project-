const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Types.ObjectId,
      ref: "learners",
      required: true,
    },
    courseId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "courses",
        required: true,
      },
    ],
    checked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const cartModel = mongoose.model("carts", cartSchema);

module.exports = cartModel;
