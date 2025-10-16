const express = require("express");
const { getHomeContent } = require("../../controller/home/homeController");
const router = express.Router();

router.route("/").get(getHomeContent);

module.exports = router;
