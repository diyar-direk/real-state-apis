const mongoose = require("mongoose");
const agencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: { type: String },
    phone: { type: String, required: true },
    logo: { type: String },
    city: {
      ref: "City",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    region: {
      ref: "Region",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    addressDetails: { type: String },
    coordinant: { type: String },
    contractorId: {
      ref: "Contractor",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdBy: {
      ref: "Users",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);
const Agency = mongoose.model("Agency", agencySchema);
module.exports = Agency;
