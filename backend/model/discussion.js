const mongoose = require("mongoose");
const discussionSchema = new mongoose.Schema(
  {
    discussion:[
      {
    learnerId: {
      type: mongoose.Types.ObjectId,
      ref: "learners",
    },
    instructorId: {
      type: mongoose.Types.ObjectId,
      ref: "instructors",
    },
    lessonId: {
      type: mongoose.Types.ObjectId,
      ref: "lessons",
    },
    text: {
      type: String,
      required: true,
    },
  }
] 
  },
  { timestamps: true }
);
const discussionModel = mongoose.model("discussions", discussionSchema);
module.exports = discussionModel;
