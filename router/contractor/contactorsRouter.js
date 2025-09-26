const express = require("express");
const router = express.Router();
const allowedTo = require("../../middleware/allowedTo");
const {
  getAll,
  addContractor,
  deleteContractor,
  getById,
  updateContractor,
} = require("../../controller/contractor/contractorController");
const upload = require("../../middleware/filesMiddleware");

router
  .route("/")
  .get(getAll)
  .post(
    allowedTo("Admin"),
    upload("../public/images/profiles").single("profile"),
    addContractor
  )
  .delete(allowedTo("Admin"), deleteContractor);

router
  .route("/:id")
  .get(getById)
  .patch(
    allowedTo("Admin", "Contractor"),
    upload("../public/images/profiles").single("profile"),
    updateContractor
  );

module.exports = router;
