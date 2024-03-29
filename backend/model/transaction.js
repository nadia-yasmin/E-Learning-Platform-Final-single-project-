const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    cartId: {
      type: mongoose.Types.ObjectId,
      ref: "carts",
      required: true,
    },
    courseId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "courses",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const transactionModel = mongoose.model("transactions", transactionsSchema);

module.exports = transactionModel;
