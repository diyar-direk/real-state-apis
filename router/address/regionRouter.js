const express = require("express");

const router = express.Router();
const allowedTo = require("../../middleware/allowedTo");
const {
  getAllRegions,
  createRegion,
  deleteRegion,
  updateRegion,
  getRegionById,
} = require("../../controller/address/regionController");

router
  .route("/")
  .get(getAllRegions)
  .post(allowedTo("Admin"), createRegion)
  .delete(allowedTo("Admin"), deleteRegion);

router.route("/:id").patch(allowedTo("Admin"), updateRegion).get(getRegionById);

module.exports = router;
