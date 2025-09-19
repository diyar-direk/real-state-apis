const mongoose = require("mongoose");
const regionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

regionSchema.index({ name: 1, cityId: 1 }, { unique: true });

const Region = mongoose.model("Region", regionSchema);
module.exports = Region;
