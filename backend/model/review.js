const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    learnerId: {
      type: mongoose.Types.ObjectId,
      ref: "learners",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const reviewModel = mongoose.model("reviews", reviewSchema);
module.exports = reviewModel;
