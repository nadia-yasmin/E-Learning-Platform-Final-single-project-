const mongoose = require("mongoose");
const authSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructors",
    },
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "learners",
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      required: true,
    },

    blocked: {
      type: Boolean,
      default: false,
    },
    loginAttempts: [
      {
        timestamp: {
          type: Date,
          required: true,
        },
      },
    ],
    resetPassword: {
      type: Boolean || null,
      required: false,
      default: false,
    },
    resetPasswordToken: {
      type: String || null,
      required: false,
      default: null,
    },
    resetPasswordExpire: {
      type: Date || null,
      required: false,
      default: null,
    },
    token: [
      {
        type: String,
        required: false,
      },
    ],
  },
  { timestamps: true }
);
const authModel = mongoose.model("authentications", authSchema);

module.exports = authModel;
