const mongoose = require("mongoose");
const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    courseId: {
      type: mongoose.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    slide: {
      type: String,
      required: false,
    },
    assignment: {
      type: String,
    },
    discussion: [
      {
        type: mongoose.Types.ObjectId,
        ref: "discussions",
      },
    ],
    quiz: {
      type: mongoose.Types.ObjectId,
      ref: "quizzes",
    },
    video: {
      type: String,
    },
  },
  { timestamps: true }
);
const lessonModel = mongoose.model("lessons", lessonSchema);
module.exports = lessonModel;