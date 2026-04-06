const express = require("express");
const {
  getCatalog,
  getRequests,
  createRequest,
} = require("../controllers/serviceController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.get("/catalog", getCatalog);
router.get("/requests", getRequests);
router.post("/requests", createRequest);

module.exports = router;
