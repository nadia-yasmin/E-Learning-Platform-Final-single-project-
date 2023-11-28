const mongoose = require("mongoose");

const notificationadminSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const notificationadminModel = mongoose.model(
  "notificationadmins",
  notificationadminSchema
);

module.exports = notificationadminModel;
