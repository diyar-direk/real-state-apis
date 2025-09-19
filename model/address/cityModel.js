const mongoose = require("mongoose");
const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

citySchema.index({ name: 1 }, { unique: true });

const City = mongoose.model("City", citySchema);
module.exports = City;
