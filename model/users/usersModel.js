const mongoose = require("mongoose");
const usersSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trime: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["Admin", "Contractor"],
      default: "Contractor",
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "role",
    },
    createdBy: {
      ref: "Users",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);
usersSchema.index({ username: 1 }, { unique: true });

usersSchema.index({ profileId: 1 }, { unique: true });

module.exports = mongoose.model("Users", usersSchema);
