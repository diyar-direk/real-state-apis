const mongoose = require("mongoose");
const typeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

typeSchema.index({ name: 1 }, { unique: true });

const PropertyType = mongoose.model("PropertyType", typeSchema);
module.exports = PropertyType;
