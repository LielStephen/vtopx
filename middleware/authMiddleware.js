const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

async function requireAuth(req, res, next) {
  try {
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = req.cookies.portalToken || bearerToken;

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.studentId);

    if (!student) {
      return res.status(401).json({ message: "Account not found." });
    }

    req.student = student;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
}

function requireAdmin(req, res, next) {
  if (req.student?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  return next();
}

module.exports = { requireAuth, requireAdmin };
