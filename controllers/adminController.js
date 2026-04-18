const Student = require("../models/Student");
const { buildDefaultPortalData, ensureStudentPortalData } = require("../config/portalSeed");

function buildUserPayload(student) {
  return {
    id: student._id,
    fullName: student.fullName,
    regNo: student.regNo,
    email: student.email,
    department: student.department,
    specialization: student.specialization,
    academicYear: student.academicYear,
    bio: student.bio,
    school: student.school,
    program: student.program,
    semester: student.semester,
    section: student.section,
    mentorName: student.mentorName,
    role: student.role,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeRegNo(regNo) {
  return String(regNo || "").trim().toUpperCase();
}

async function listUsers(req, res) {
  try {
    const users = await Student.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      users: users.map((user) => buildUserPayload(user)),
      stats: {
        total: users.length,
        admins: users.filter((user) => user.role === "admin").length,
        students: users.filter((user) => user.role !== "admin").length,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load users right now." });
  }
}

async function createUser(req, res) {
  try {
    const { fullName, regNo, email, password, department, specialization, academicYear, role, bio } = req.body;

    if (!fullName || !regNo || !email || !password || !department || !academicYear) {
      return res.status(400).json({ message: "Fill in all required user fields." });
    }

    const normalizedEmail = normalizeEmail(email);
    const normalizedRegNo = normalizeRegNo(regNo);
    const normalizedRole = role === "admin" ? "admin" : "student";

    const existingStudent = await Student.findOne({
      $or: [{ email: normalizedEmail }, { regNo: normalizedRegNo }],
    });

    if (existingStudent) {
      return res.status(409).json({ message: "A user already exists with this email or registration number." });
    }

    const student = await Student.create({
      fullName,
      regNo: normalizedRegNo,
      email: normalizedEmail,
      password,
      department,
      specialization,
      academicYear,
      bio,
      role: normalizedRole,
      ...buildDefaultPortalData({
        regNo: normalizedRegNo,
        department,
        academicYear,
      }),
    });

    return res.status(201).json({
      message: "User created successfully.",
      user: buildUserPayload(student),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create the user right now." });
  }
}

async function updateUser(req, res) {
  try {
    const { fullName, regNo, email, password, department, specialization, academicYear, role, bio } = req.body;
    const user = await Student.findById(req.params.userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const nextEmail = normalizeEmail(email || user.email);
    const nextRegNo = normalizeRegNo(regNo || user.regNo);

    const duplicateUser = await Student.findOne({
      _id: { $ne: user._id },
      $or: [{ email: nextEmail }, { regNo: nextRegNo }],
    });

    if (duplicateUser) {
      return res.status(409).json({ message: "Another user already uses this email or registration number." });
    }

    user.fullName = fullName || user.fullName;
    user.regNo = nextRegNo;
    user.email = nextEmail;
    user.department = department || user.department;
    user.specialization = specialization || user.specialization;
    user.academicYear = academicYear || user.academicYear;
    user.bio = bio || user.bio;
    user.role = role === "admin" ? "admin" : "student";

    if (password) {
      user.password = password;
    }

    ensureStudentPortalData(user);
    await user.save();

    return res.json({
      message: "User updated successfully.",
      user: buildUserPayload(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update the user right now." });
  }
}

async function deleteUser(req, res) {
  try {
    if (String(req.student._id) === String(req.params.userId)) {
      return res.status(400).json({ message: "You cannot delete your own admin account." });
    }

    const user = await Student.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ message: "User deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete the user right now." });
  }
}

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
};
