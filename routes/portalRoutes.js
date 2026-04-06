const express = require("express");
const {
  getDashboard,
  getAcademics,
  getRequestsData,
  createRequest,
  submitAssignment,
} = require("../controllers/portalController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.get("/dashboard", getDashboard);
router.get("/academics", getAcademics);
router.get("/requests", getRequestsData);
router.post("/requests", createRequest);
router.post("/assignments/:assignmentId/submit", submitAssignment);

module.exports = router;
