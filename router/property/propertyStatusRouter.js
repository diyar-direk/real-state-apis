const express = require("express");

const router = express.Router();
const allowedTo = require("../../middleware/allowedTo");
const {
  getAllStatus,
  createStatus,
  deleteStatus,
  updateStatus,
  getStatusById,
} = require("../../controller/property/propertyStatusController");

router
  .route("/")
  .get(getAllStatus)
  .post(allowedTo("Admin"), createStatus)
  .delete(allowedTo("Admin"), deleteStatus);

router.route("/:id").patch(allowedTo("Admin"), updateStatus).get(getStatusById);

module.exports = router;
