const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "types",
      },
    ],
  },
  { timestamps: true }
);
const categoryModel = mongoose.model("categories", categorySchema);

module.exports = categoryModel;
