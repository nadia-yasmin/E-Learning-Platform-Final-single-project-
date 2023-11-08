const mongoose = require("mongoose");
const typeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },
  },
  { timestamps: true }
);
const typeModel = mongoose.model("types", typeSchema);

module.exports = typeModel;
