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
    description: {
      type: String,
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
      diagram: {
        type: String,
      },
      text: {
        type: String,
      },
    },
    discussion:
      {
        type: mongoose.Types.ObjectId,
        ref: "discussions",
      },
    
    quiz: {
      type: mongoose.Types.ObjectId,
      ref: "quizzes",
    },
    video: {
      type: String,
    },
    week:
      {
        type: Number,
      },
  },
  { timestamps: true }
);
const lessonModel = mongoose.model("lessons", lessonSchema);
module.exports = lessonModel;
