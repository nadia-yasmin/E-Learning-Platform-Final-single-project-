const mongoose = require("mongoose");
const learnerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email must be given"],
    },
    name: {
      type: String,
      required: [true, "name must be given"],
    },
    cartId: {
      type: mongoose.Types.ObjectId,
      ref: "carts",
    },
    transactionId: {
      type: mongoose.Types.ObjectId,
      ref: "transactions",
    },
    userblocked: {
      type: Boolean,
      default: false,
    },
    course: [
      {
        courseId: {
          type: mongoose.Types.ObjectId,
          ref: "courses",
        },
        enrollment: {
          type: Boolean,
          default: false,
        },
      },
    ],
    role: {
      type: String,
      required: [true, "role must be given"],
    },
    image: {
      type: String,
    },
    quiz: [
      {
        quizId: {
          type: mongoose.Types.ObjectId,
          ref: "quizzes",
        },
        score: {
          type: Number,
          default: 0,
        },
      },
    ],
    quizsubmissionId: {
      type: mongoose.Types.ObjectId,
      ref: "quizsubmissions",
    },
    wishlistId: {
      type: mongoose.Types.ObjectId,
      ref: "wishlists",
    },
    assignmentsubmissionId: {
      type: mongoose.Types.ObjectId,
      ref: "assignmentsubmissions",
    },
  },
  { timestamps: true }
);
const learnerModel = mongoose.model("learners", learnerSchema);
module.exports = learnerModel;
