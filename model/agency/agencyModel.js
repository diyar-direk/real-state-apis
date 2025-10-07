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
    contractors: {
      type: [{ ref: "Contractor", type: mongoose.Schema.Types.ObjectId }],

      validate: {
        validator: (arr) => arr.length > 0,
        message: "you have select agencie's owner",
      },
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
