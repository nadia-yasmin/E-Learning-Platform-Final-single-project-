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
    instructor: {
      type: mongoose.Types.ObjectId,
      ref: "instructors",
      required: true,
    },
    course: {
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
      required: false,
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
