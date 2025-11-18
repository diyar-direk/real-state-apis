const mongoose = require("mongoose");
const { role } = require("../../constants/enums");
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
      enum: Object.values(role),
      default: role.contractor,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "role",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    expirationDate: {
      type: Date,
    },
    createdBy: {
      ref: "Users",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

usersSchema.pre("save", function (next) {
  if (this.role !== role.admin && !this.expirationDate) {
    const oneWeekLater = new Date();
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    this.expirationDate = oneWeekLater;
  }
  next();
});

usersSchema.index({ username: 1 }, { unique: true });

usersSchema.index(
  { profileId: 1 },
  {
    unique: true,
    partialFilterExpression: { profileId: { $type: "objectId" } },
  }
);

module.exports = mongoose.model("Users", usersSchema);
