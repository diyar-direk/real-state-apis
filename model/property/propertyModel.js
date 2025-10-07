const mongoose = require("mongoose");
const propertySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "PropertyType",
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "PropertyStatus",
    },
    area: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    floorsCount: {
      type: Number,
      required: true,
      min: 0,
    },
    roomsCount: {
      type: Number,
      required: true,
      min: 0,
    },
    isFrunished: {
      type: Boolean,
      default: false,
    },
    yearBuilt: {
      type: Date,
    },
    featuers: {
      type: String,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "City",
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Region",
    },
    nearbyPlaces: {
      type: String,
    },
    addressDetails: {
      type: String,
    },
    coordinant: {
      type: String,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Contractor",
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
    },
    coverImage: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

propertySchema.virtual("images", {
  ref: "PropertyImage",
  localField: "_id",
  foreignField: "propertyId",
});

propertySchema.set("toObject", { virtuals: true });
propertySchema.set("toJSON", { virtuals: true });

propertySchema.index({ title: 1, description: 1 });

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
