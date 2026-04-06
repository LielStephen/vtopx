const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const { buildDefaultPortalData, ensureStudentPortalData } = require("../config/portalSeed");

function buildStudentPayload(student) {
  return {
    id: student._id,
    fullName: student.fullName,
    regNo: student.regNo,
    email: student.email,
    department: student.department,
    academicYear: student.academicYear,
    school: student.school,
    program: student.program,
    semester: student.semester,
    section: student.section,
    mentorName: student.mentorName,
    cgpa: student.cgpa,
    role: student.role,
    createdAt: student.createdAt,
  };
}

function createToken(studentId) {
  return jwt.sign({ studentId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function setAuthCookie(res, token) {
  res.cookie("portalToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function register(req, res) {
  try {
    const { fullName, regNo, email, password, department, academicYear } = req.body;

    if (!fullName || !regNo || !email || !password || !department || !academicYear) {
      return res.status(400).json({ message: "Fill in all registration fields." });
    }

    const existingStudent = await Student.findOne({
      $or: [{ email: email.toLowerCase() }, { regNo: regNo.toUpperCase() }],
    });

    if (existingStudent) {
      return res.status(409).json({
        message: "A student account already exists with this email or registration number.",
      });
    }

    const student = await Student.create({
      fullName,
      regNo,
      email,
      password,
      department,
      academicYear,
      role: req.body.role === "admin" ? "admin" : "student",
      ...buildDefaultPortalData({ regNo, department, academicYear }),
    });

    const token = createToken(student._id);
    setAuthCookie(res, token);

    return res.status(201).json({
      message: "Student account created successfully.",
      student: buildStudentPayload(student),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to create account right now." });
  }
}

async function login(req, res) {
  try {
    const { identifier, email, password } = req.body;
    const normalizedIdentifier = String(identifier || email || "")
      .trim();

    if (!normalizedIdentifier || !password) {
      return res.status(400).json({ message: "Registration number or email and password are required." });
    }

    const query = normalizedIdentifier.includes("@")
      ? { email: normalizedIdentifier.toLowerCase() }
      : { regNo: normalizedIdentifier.toUpperCase() };

    const student = await Student.findOne(query).select("+password");

    if (!student) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatches = await student.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (ensureStudentPortalData(student)) {
      await student.save();
    }

    const token = createToken(student._id);
    setAuthCookie(res, token);

    return res.json({
      message: "Login successful.",
      student: buildStudentPayload(student),
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to log in right now." });
  }
}

function logout(req, res) {
  res.cookie("portalToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
  });

  return res.json({ message: "Logged out successfully." });
}

async function getCurrentStudent(req, res) {
  if (ensureStudentPortalData(req.student)) {
    await req.student.save();
  }

  return res.json({ student: buildStudentPayload(req.student) });
}

module.exports = {
  register,
  login,
  logout,
  getCurrentStudent,
};
