const express = require("express");
const { getLandingData } = require("../controllers/publicController");

const router = express.Router();

router.get("/landing", getLandingData);

module.exports = router;
