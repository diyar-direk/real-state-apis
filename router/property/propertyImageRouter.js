const express = require("express");
const {
  allImages,
  imageById,
  deleteImages,
  addPropertyImage,
} = require("../../controller/property/proertyImageController");
const router = express.Router();
const allowedTo = require("../../middleware/allowedTo");
const createUploader = require("../../middleware/filesMiddleware");
const upload = createUploader("../public/images/property");

router
  .route("/")
  .get(allImages)
  .delete(allowedTo("Admin", "Contractor"), deleteImages)
  .post(
    allowedTo("Admin", "Contractor"),
    upload.array("images"),
    addPropertyImage
  );

router.route("/:id").get(imageById);

module.exports = router;
