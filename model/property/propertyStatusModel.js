const mongoose = require("mongoose");
const ststusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

ststusSchema.index({ name: 1 }, { unique: true });

const PropertyStatus = mongoose.model("PropertyStatus", ststusSchema);
module.exports = PropertyStatus;
