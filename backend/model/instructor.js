const mongoose = require("mongoose");
const instructorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email must be given"],
    },
    name: {
      type: String,
      required: [true, "name must be given"],
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
  },
  { timestamps: true }
);
const instructorModel = mongoose.model("instructors", instructorSchema);

module.exports = instructorModel;
