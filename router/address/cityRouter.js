const express = require("express");
const {
  getAllCities,
  createCity,
  deleteCity,
  updateCity,
  getCityById,
} = require("../../controller/address/cityController");
const router = express.Router();
const allowedTo = require("../../middleware/allowedTo");

router
  .route("/")
  .get(getAllCities)
  .post(allowedTo("Admin"), createCity)
  .delete(allowedTo("Admin"), deleteCity);

router.route("/:id").patch(allowedTo("Admin"), updateCity).get(getCityById);

module.exports = router;
