const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: [/^[a-zA-Z][a-zA-Z0-9._]{2,19}$/, "Invalid username format"],
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["Admin", "Contractor"],
      default: "Contractor",
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "role",
      validate: {
        validator: function (value) {
          if (this.role === "Admin") {
            return true;
          }
          return Boolean(value);
        },
        message: "profileId is required for non-admin users",
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      ref: "Users",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);
usersSchema.index({ username: 1 }, { unique: true });

usersSchema.index(
  { profileId: 1 },
  {
    unique: true,
    partialFilterExpression: { profileId: { $type: "objectId" } },
  }
);

module.exports = mongoose.model("Users", usersSchema);
