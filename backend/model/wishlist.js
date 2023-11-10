const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema(
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
const wishlistModel = mongoose.model("wishlists", wishlistSchema);

module.exports = wishlistModel;
