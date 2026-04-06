const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentStudent,
} = require("../controllers/authController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", requireAuth, requireAdmin, register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, getCurrentStudent);

module.exports = router;
