const mongoose = require("mongoose");
const imagesSchema = mongoose.Schema(
  {
    src: {
      type: String,
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  { Timestamp: true }
);

const PropertyImage = mongoose.model("PropertyImage", imagesSchema);
module.exports = PropertyImage;
