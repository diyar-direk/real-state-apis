const express = require("express");
const router = express.Router();

const allowedTo = require("../../middleware/allowedTo");

const createUploader = require("../../middleware/filesMiddleware");
const {
  allAgency,
  createAgency,
  deleteAgency,
  agencyById,
  deleteAgencyById,
  updateAgency,
} = require("../../controller/agency/agencyController");
const upload = createUploader("../public/images/agency");

router
  .route("/")
  .get(allAgency)
  .post(allowedTo("Admin"), upload.single("logo"), createAgency)
  .delete(allowedTo("Admin"), deleteAgency);

router
  .route("/:id")
  .get(agencyById)
  .delete(allowedTo("Admin", "Contractor"), deleteAgencyById)
  .patch(allowedTo("Admin", "Contractor"), upload.single("logo"), updateAgency);

module.exports = router;
