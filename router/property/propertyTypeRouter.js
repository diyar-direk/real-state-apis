const express = require("express");

const router = express.Router();
const allowedTo = require("../../middleware/allowedTo");
const {
  getAllTypes,
  createType,
  deleteType,
  updateType,
  getTypeById,
} = require("../../controller/property/propertyTypeController");

router
  .route("/")
  .get(getAllTypes)
  .post(allowedTo("Admin"), createType)
  .delete(allowedTo("Admin"), deleteType);

router.route("/:id").patch(allowedTo("Admin"), updateType).get(getTypeById);

module.exports = router;
