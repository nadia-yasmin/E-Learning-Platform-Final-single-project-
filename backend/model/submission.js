const mongoose = require("mongoose");
const submissionSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Types.ObjectId,
      ref: "lessons",
    },

    learnerId: {
      type: mongoose.Types.ObjectId,
      ref: "learners",
    },

    quizId: {
      type: mongoose.Types.ObjectId,
      ref: "quizzes",
    },
  },
  { timestamps: true }
);
const submissionModel = mongoose.model("submissions", submissionSchema);
module.exports = submissionModel;
