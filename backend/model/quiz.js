const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Types.ObjectId,
      ref: "lessons",
    },
    quiz: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            text: {
              type: String,
              required: true,
            },
            correct: {
              type: Boolean,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
const quizModel = mongoose.model("quizzes", quizSchema);
module.exports = quizModel;
