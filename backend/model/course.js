const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Types.ObjectId,
    ref: "instructors",
    required: true,
  },
  lesson: [
    {
      type: mongoose.Types.ObjectId,
      ref: "lessons",
    },
  ],
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: "reviews",
    },
  ],
  ratings: {
    userRate: [
      {
        type: mongoose.Types.ObjectId,
        ref: "rates",
      },
    ],
    rate: {
      type: Number,
      default: 0,
    },
  },
  image: {
    type: String,
  },
  intro: {
    type: String,
  },
  //   companies: [
  //     {
  //       type: String,
  //     },
  //   ],
  content: {
    assignment: {
      type: Number,
      default: 0,
    },
    quiz: {
      type: Number,
      default: 0,
    },
    videos: {
      type: Number,
      default: 0,
    },
    slides: {
      type: Number,
      default: 0,
    },
  },
});

const courseModel = mongoose.model("courses", courseSchema);

module.exports = courseModel;
