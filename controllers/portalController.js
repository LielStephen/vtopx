const ServiceRequest = require("../models/ServiceRequest");
const { ensureStudentPortalData } = require("../config/portalSeed");

const requestTypes = [
  "Leave Request",
  "Bonafide Certificate",
  "Revaluation",
  "Faculty Assistance",
];

function averageAttendance(courses) {
  if (!courses.length) {
    return 0;
  }

  const total = courses.reduce((sum, course) => sum + Number(course.attendancePercentage || 0), 0);
  return Math.round(total / courses.length);
}

function buildStudentSummary(student) {
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
    creditsRegistered: student.creditsRegistered,
    creditsEarned: student.creditsEarned,
    role: student.role,
  };
}

async function hydratePortalData(student) {
  const changed = ensureStudentPortalData(student);

  student.assignments.forEach((assignment) => {
    if (assignment.status === "Pending" && new Date(assignment.dueDate) < new Date()) {
      assignment.status = "Overdue";
    }
  });

  if (student.isModified()) {
    await student.save();
    return;
  }

  if (changed) {
    await student.save();
  }
}

function requestStats(requests) {
  return {
    total: requests.length,
    pending: requests.filter((request) => request.status === "Pending").length,
    inReview: requests.filter((request) => request.status === "In Review").length,
    approved: requests.filter((request) => request.status === "Approved").length,
    closed: requests.filter((request) => request.status === "Closed").length,
  };
}

function todayName() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Asia/Calcutta",
  }).format(new Date());
}

async function getDashboard(req, res) {
  try {
    await hydratePortalData(req.student);

    const requests = (
      await ServiceRequest.find({ student: req.student._id })
      .sort({ createdAt: -1 })
      .lean()
    ).map((request) => ({
      ...request,
      requestType: request.requestType || request.serviceType || "Faculty Assistance",
    }));

    const courses = [...req.student.courses].sort((left, right) => {
      return right.attendancePercentage - left.attendancePercentage;
    });

    const assignments = [...req.student.assignments].sort((left, right) => {
      return new Date(left.dueDate) - new Date(right.dueDate);
    });

    const assessments = [...req.student.assessments].sort((left, right) => {
      return new Date(left.examDate) - new Date(right.examDate);
    });

    const weekday = todayName();
    const todaySchedule = req.student.schedule.filter((entry) => entry.day === weekday);

    return res.json({
      student: buildStudentSummary(req.student),
      spotlight: req.student.spotlight,
      quickLinks: req.student.quickLinks,
      overview: {
        attendanceAverage: averageAttendance(req.student.courses),
        lowAttendanceCount: req.student.courses.filter((course) => course.attendancePercentage < 75).length,
        pendingAssignments: assignments.filter((assignment) => assignment.status !== "Submitted").length,
        publishedMarks: assessments.filter((assessment) => assessment.status === "Published").length,
      },
      courses,
      todaySchedule,
      schedule: req.student.schedule,
      assessments,
      assignments,
      requests,
      requestStats: requestStats(requests),
      requestTypes,
      today: weekday,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load portal data right now." });
  }
}

async function getAcademics(req, res) {
  try {
    await hydratePortalData(req.student);

    const weekday = todayName();
    const courses = [...req.student.courses].sort((left, right) => left.code.localeCompare(right.code));
    const assessments = [...req.student.assessments].sort((left, right) => new Date(left.examDate) - new Date(right.examDate));
    const assignments = [...req.student.assignments].sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate));
    const todaySchedule = req.student.schedule.filter((entry) => entry.day === weekday);

    return res.json({
      student: buildStudentSummary(req.student),
      courses,
      assessments,
      assignments,
      todaySchedule,
      schedule: req.student.schedule,
      today: weekday,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load academic data right now." });
  }
}

async function getRequestsData(req, res) {
  try {
    const requests = (
      await ServiceRequest.find({ student: req.student._id })
        .sort({ createdAt: -1 })
        .lean()
    ).map((request) => ({
      ...request,
      requestType: request.requestType || request.serviceType || "Faculty Assistance",
    }));

    return res.json({
      student: buildStudentSummary(req.student),
      requests,
      requestStats: requestStats(requests),
      requestTypes,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load request data right now." });
  }
}

async function createRequest(req, res) {
  try {
    const { requestType, title, description, courseCode, fromDate, toDate } = req.body;

    if (!requestType || !title || !description) {
      return res.status(400).json({ message: "Fill in request type, title, and description." });
    }

    if (!requestTypes.includes(requestType)) {
      return res.status(400).json({ message: "Choose a valid portal activity." });
    }

    if (requestType === "Leave Request" && (!fromDate || !toDate)) {
      return res.status(400).json({ message: "Leave requests need both start and end dates." });
    }

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({ message: "The leave end date must be after the start date." });
    }

    const request = await ServiceRequest.create({
      student: req.student._id,
      requestType,
      title,
      description,
      courseCode,
      fromDate,
      toDate,
      status: requestType === "Leave Request" ? "In Review" : "Pending",
    });

    return res.status(201).json({
      message: "Portal request submitted successfully.",
      request,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not submit the portal request." });
  }
}

async function submitAssignment(req, res) {
  try {
    await hydratePortalData(req.student);

    const assignment = req.student.assignments.id(req.params.assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment record not found." });
    }

    if (assignment.status === "Submitted") {
      return res.status(409).json({ message: "This assignment has already been submitted." });
    }

    assignment.status = "Submitted";
    assignment.submittedAt = new Date();
    await req.student.save();

    return res.json({
      message: "Assignment marked as submitted.",
      assignment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Assignment submission could not be completed." });
  }
}

module.exports = {
  getDashboard,
  getAcademics,
  getRequestsData,
  createRequest,
  submitAssignment,
};
