const express = require("express");
const {
  getAllUsers,
  deleteUsers,
  getUserById,
  updateUser,
  login,
  register,
} = require("../../controller/users/userController");
const allowedTo = require("../../middleware/allowedTo");

const router = express.Router();

router
  .route("/")
  .get(allowedTo("Admin"), getAllUsers)
  .delete(allowedTo("Admin"), deleteUsers)
  .post(allowedTo("Admin"), register);
router.route("/login").post(allowedTo("Admin"), login);
router
  .route("/:id")
  .get(allowedTo("Admin"), getUserById)
  .patch(allowedTo("Admin"), updateUser);
module.exports = router;
