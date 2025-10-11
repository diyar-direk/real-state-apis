const express = require("express");
const {
  getAllUsers,
  deleteUsers,
  getUserById,
  updateUser,
  login,
  register,
  getMyProfile,
} = require("../../controller/users/userController");
const allowedTo = require("../../middleware/allowedTo");
const IsAuthenticated = require("../../middleware/IsAuthenticated");
const createLimiter = require("../../middleware/rateLimiter");

const router = express.Router();

const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});
const registerLimier = createLimiter({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message:
    "To many accounts created from this IP, please try again after an hour",
});

router
  .route("/")
  .get(allowedTo("Admin"), getAllUsers)
  .delete(allowedTo("Admin"), deleteUsers)
  .post(registerLimier, register);
router.route("/login").post(loginLimiter, login);
router.route("/me").get(IsAuthenticated, getMyProfile);
router
  .route("/:id")
  .get(allowedTo("Admin"), getUserById)
  .patch(allowedTo("Admin"), updateUser);
module.exports = router;
