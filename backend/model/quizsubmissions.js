const mongoose = require("mongoose");
const quizsubmissionSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Types.ObjectId,
      ref: "learners",
      required: true,
    },
    quizId: {
      type: mongoose.Types.ObjectId,
      ref: "quizzes",
      required: true,
    },
    submission: [
      {
        questionId: {
          type: String,
        },
        optionId: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
const quizsubmissionModel = mongoose.model(
  "quizsubmissions",
  quizsubmissionSchema
);

module.exports = quizsubmissionModel;
