const mongoose = require("mongoose");

const contractorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    birthDate: {
      type: Date,
      required: true,
    },
    birthPlace: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    education: {
      type: String,
    },
    experienceYears: {
      type: Number,
    },
    resume: {
      type: String,
    },
    profile: {
      type: String,
    },
    links: [
      {
        type: {
          type: String,
          enum: ["instagram", "facebook", "linkedin", "twitter"],
          required: true,
        },
        link: {
          type: String,
          required: true,
          validate: {
            validator: function (value) {
              switch (this.type) {
                case "facebook":
                  return /^https?:\/\/(www\.)?facebook\.com\/.+$/.test(value);
                case "instagram":
                  return /^https?:\/\/(www\.)?instagram\.com\/.+$/.test(value);
                case "linkedin":
                  return /^https?:\/\/(www\.)?linkedin\.com\/.+$/.test(value);
                case "twitter":
                  return /^https?:\/\/(www\.)?twitter\.com\/.+$/.test(value);
                default:
                  return false;
              }
            },
            message: (props) =>
              `${props.value} is not a valid URL for ${props.path}`,
          },
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

contractorSchema.index({
  firstName: 1,
  middleName: 1,
  lastName: 1,
});

contractorSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } }
);

module.exports = new mongoose.model("Contractor", contractorSchema);
