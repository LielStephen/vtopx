const Student = require("../models/Student");
const { buildDefaultPortalData } = require("./portalSeed");

async function bootstrapAdmin() {
  const adminEmail = (process.env.DEFAULT_ADMIN_EMAIL || "admin@vtopx.edu").toLowerCase();
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@123";
  const adminRegNo = (process.env.DEFAULT_ADMIN_REGNO || "VTOPXADMIN01").toUpperCase();

  const existingAdmin = await Student.findOne({
    $or: [{ email: adminEmail }, { role: "admin" }],
  });

  if (existingAdmin) {
    return;
  }

  await Student.create({
    ...buildDefaultPortalData({
      regNo: adminRegNo,
      department: "CSE",
      academicYear: "4th Year",
    }),
    fullName: "vtopx Admin",
    regNo: adminRegNo,
    email: adminEmail,
    password: adminPassword,
    department: "ADMIN",
    academicYear: "Admin",
    role: "admin",
    school: "Administration",
    program: "vtopx Portal Administration",
    semester: "Control Room",
    section: "A",
    mentorName: "System",
    cgpa: 10,
    creditsRegistered: 0,
    creditsEarned: 0,
  });

  console.log(`Default admin created: ${adminEmail}`);
}

module.exports = bootstrapAdmin;
