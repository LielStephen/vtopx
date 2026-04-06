const express = require("express");
const {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth, requireAdmin);
router.get("/users", listUsers);
router.post("/users", createUser);
router.put("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

module.exports = router;
