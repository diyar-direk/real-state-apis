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
const createLimiter = require("../../middleware/rateLimiter");

const registerLimiter = createLimiter({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message:
    "To many accounts created from this IP, please try again after an hour",
});

router
  .route("/")
  .get(getAll)
  .post(
    registerLimiter,
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
