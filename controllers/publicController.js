const Student = require("../models/Student");
const ServiceRequest = require("../models/ServiceRequest");

async function getLandingData(req, res) {
  try {
    const [totalUsers, totalStudents, totalAdmins, totalRequests, latestUsers] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ role: { $ne: "admin" } }),
      Student.countDocuments({ role: "admin" }),
      ServiceRequest.countDocuments(),
      Student.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select("fullName regNo role")
        .lean(),
    ]);

    return res.json({
      portalName: "vtopx",
      portalLabel: "Student Portal",
      databaseName: "vtopx",
      headline: "Login with credentials stored in the vtopx database.",
      subheadline:
        "This portal uses MongoDB for login credentials, student records, requests, and admin-only user CRUD operations.",
      stats: {
        totalUsers,
        totalStudents,
        totalAdmins,
        totalRequests,
      },
      latestUsers,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load landing data right now." });
  }
}

module.exports = {
  getLandingData,
};
