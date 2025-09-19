const express = require("express");
const {
  getAllProperties,
  addProperty,
  propertyById,
  updateProperty,
  deleteProperty,
} = require("../../controller/property/propertyController");
const router = express.Router();
const allowedTo = require("../../middleware/allowedTo");
const createUploader = require("../../middleware/filesMiddleware");
const upload = createUploader("../public/images/property");

router
  .route("/")
  .get(getAllProperties)
  .post(allowedTo("Admin", "Contractor"), upload.array("images"), addProperty)
  .delete(allowedTo("Admin", "Contractor"), deleteProperty);

router
  .route("/:id")
  .get(propertyById)
  .patch(
    allowedTo("Admin", "Contractor"),
    upload.array("images"),
    updateProperty
  );

module.exports = router;
