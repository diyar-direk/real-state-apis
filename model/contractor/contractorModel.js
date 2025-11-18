const mongoose = require("mongoose");
const { gender, social } = require("../../constants/enums");

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
      enum: Object.values(gender),
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
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    birthPlace: {
      type: String,
    },
    address: {
      type: String,
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
          enum: Object.values(social),
          required: true,
        },
        link: {
          type: String,
          required: true,
          validate: {
            validator: function (value) {
              switch (this.type) {
                case social.facebook:
                  return /^https?:\/\/(www\.)?facebook\.com\/.+$/.test(value);
                case social.instagram:
                  return /^https?:\/\/(www\.)?instagram\.com\/.+$/.test(value);
                case social.linkedin:
                  return /^https?:\/\/(www\.)?linkedin\.com\/.+$/.test(value);
                case social.twitter:
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
  {
    email: 1,
  },
  { unique: true }
);

module.exports = new mongoose.model("Contractor", contractorSchema);
