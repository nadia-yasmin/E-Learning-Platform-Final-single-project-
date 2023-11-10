const mongoose = require("mongoose");
const assignmentsubmissionSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Types.ObjectId,
      ref: "learners",
      required: true,
    },
    lessonId: {
      type: mongoose.Types.ObjectId,
      ref: "lessons",
      required: true,
    },
    submission: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    submit: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const assignmentsubmissionModel = mongoose.model(
  "assignmentsubmissions",
  assignmentsubmissionSchema
);

module.exports = assignmentsubmissionModel;
