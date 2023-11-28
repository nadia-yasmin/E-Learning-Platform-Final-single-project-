const mongoose = require("mongoose");

const notificationinstructorSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const notificationinstructorModel = mongoose.model(
  "notificationinstructors",
  notificationinstructorSchema
);

module.exports = notificationinstructorModel;
