const departmentCatalog = {
  CSE: {
    school: "School of Computer Science and Engineering",
    program: "B.Tech Computer Science and Engineering",
    mentorName: "Dr. Kavya Reddy",
    courses: [
      {
        code: "CSE2004",
        title: "Database Management Systems",
        faculty: "Dr. Arvind Nair",
        slot: "A1+TA1",
        room: "AB2-503",
        attendancePercentage: 86,
        attendedClasses: 31,
        totalClasses: 36,
      },
      {
        code: "CSE3012",
        title: "Computer Networks",
        faculty: "Dr. Sujatha Menon",
        slot: "B1+TB1",
        room: "AB1-402",
        attendancePercentage: 79,
        attendedClasses: 27,
        totalClasses: 34,
      },
      {
        code: "CSE3025",
        title: "Web Programming",
        faculty: "Prof. S. Meghana",
        slot: "C1+TC1",
        room: "AB3-601",
        attendancePercentage: 92,
        attendedClasses: 33,
        totalClasses: 36,
      },
      {
        code: "MAT2002",
        title: "Probability and Statistics",
        faculty: "Dr. P. Bhaskar",
        slot: "D1+TD1",
        room: "AB1-210",
        attendancePercentage: 74,
        attendedClasses: 25,
        totalClasses: 34,
      },
    ],
    assessments: [
      {
        courseCode: "CSE2004",
        title: "CAT 1",
        type: "Internal",
        maxMarks: 50,
        scoredMarks: 43,
        weightage: "15%",
        examDate: new Date("2026-03-10T09:30:00.000Z"),
        status: "Published",
      },
      {
        courseCode: "CSE3012",
        title: "Quiz 2",
        type: "Quiz",
        maxMarks: 10,
        scoredMarks: 8,
        weightage: "5%",
        examDate: new Date("2026-03-18T06:30:00.000Z"),
        status: "Published",
      },
      {
        courseCode: "CSE3025",
        title: "Digital Assignment Review",
        type: "Lab",
        maxMarks: 25,
        scoredMarks: 21,
        weightage: "10%",
        examDate: new Date("2026-03-27T07:30:00.000Z"),
        status: "Published",
      },
      {
        courseCode: "MAT2002",
        title: "CAT 2",
        type: "Internal",
        maxMarks: 50,
        scoredMarks: null,
        weightage: "15%",
        examDate: new Date("2026-04-14T08:30:00.000Z"),
        status: "Scheduled",
      },
    ],
    schedule: [
      {
        day: "Monday",
        startTime: "08:00",
        endTime: "08:50",
        courseCode: "CSE2004",
        title: "Database Management Systems",
        venue: "AB2-503",
        faculty: "Dr. Arvind Nair",
        type: "Theory",
      },
      {
        day: "Monday",
        startTime: "10:00",
        endTime: "10:50",
        courseCode: "MAT2002",
        title: "Probability and Statistics",
        venue: "AB1-210",
        faculty: "Dr. P. Bhaskar",
        type: "Theory",
      },
      {
        day: "Tuesday",
        startTime: "09:00",
        endTime: "09:50",
        courseCode: "CSE3012",
        title: "Computer Networks",
        venue: "AB1-402",
        faculty: "Dr. Sujatha Menon",
        type: "Theory",
      },
      {
        day: "Tuesday",
        startTime: "14:00",
        endTime: "15:40",
        courseCode: "CSE3025",
        title: "Web Programming Lab",
        venue: "AB3-601",
        faculty: "Prof. S. Meghana",
        type: "Lab",
      },
      {
        day: "Wednesday",
        startTime: "11:00",
        endTime: "11:50",
        courseCode: "CSE2004",
        title: "Database Management Systems",
        venue: "AB2-503",
        faculty: "Dr. Arvind Nair",
        type: "Theory",
      },
      {
        day: "Thursday",
        startTime: "08:00",
        endTime: "08:50",
        courseCode: "MAT2002",
        title: "Probability and Statistics",
        venue: "AB1-210",
        faculty: "Dr. P. Bhaskar",
        type: "Theory",
      },
      {
        day: "Thursday",
        startTime: "12:00",
        endTime: "12:50",
        courseCode: "CSE3012",
        title: "Computer Networks",
        venue: "AB1-402",
        faculty: "Dr. Sujatha Menon",
        type: "Tutorial",
      },
      {
        day: "Friday",
        startTime: "09:00",
        endTime: "09:50",
        courseCode: "CSE3025",
        title: "Web Programming",
        venue: "AB3-601",
        faculty: "Prof. S. Meghana",
        type: "Theory",
      },
    ],
    assignments: [
      {
        courseCode: "CSE3025",
        title: "Build a responsive student dashboard",
        subject: "Web Programming",
        dueDate: new Date("2026-04-05T17:30:00.000Z"),
        status: "Pending",
        instructions: "Submit a working UI with timetable, attendance, and marks sections.",
      },
      {
        courseCode: "CSE2004",
        title: "Normalization case study",
        subject: "Database Management Systems",
        dueDate: new Date("2026-04-08T17:30:00.000Z"),
        status: "Pending",
        instructions: "Upload a PDF report covering 1NF to BCNF conversion for the case study.",
      },
      {
        courseCode: "CSE3012",
        title: "OSI model packet trace worksheet",
        subject: "Computer Networks",
        dueDate: new Date("2026-03-24T17:30:00.000Z"),
        status: "Submitted",
        submittedAt: new Date("2026-03-23T13:40:00.000Z"),
        instructions: "Submit the completed worksheet and short summary notes.",
      },
    ],
  },
};

const sharedQuickLinks = [
  {
    label: "Course Page",
    shortCode: "CP",
    description: "Open syllabus, materials, and announcements.",
  },
  {
    label: "Attendance",
    shortCode: "AT",
    description: "Review attendance percentage course by course.",
  },
  {
    label: "Marks",
    shortCode: "MK",
    description: "Track CAT, quiz, and lab evaluation scores.",
  },
  {
    label: "Leave Request",
    shortCode: "LV",
    description: "Apply for leave and follow approval status.",
  },
];

const sharedSpotlight = [
  {
    category: "Code",
    title: "Web Programming assignment portal closes on Sunday at 11:00 PM.",
    detail: "Students must upload the dashboard submission before the late fee window starts.",
    audience: "All students",
    postedOn: new Date("2026-04-01T05:30:00.000Z"),
  },
  {
    category: "Exam",
    title: "CAT 2 seating plan for Probability and Statistics has been published.",
    detail: "Check the marks section and exam desk notice before arriving at the block.",
    audience: "Second and third year",
    postedOn: new Date("2026-03-31T09:00:00.000Z"),
  },
];

function yearToSemester(academicYear) {
  const semesterMap = {
    "1st Year": "Semester 2",
    "2nd Year": "Semester 4",
    "3rd Year": "Semester 6",
    "4th Year": "Semester 8",
  };

  return semesterMap[academicYear] || "Semester 4";
}

function departmentKey(department) {
  return String(department || "CSE").trim().toUpperCase();
}

function sectionFromRegNo(regNo) {
  const normalized = String(regNo || "").replace(/[^0-9]/g, "");
  const lastDigit = Number(normalized.slice(-1) || "0");
  const sections = ["A", "B", "C", "D"];

  return sections[lastDigit % sections.length];
}

function cloneEntries(entries) {
  return entries.map((entry) => ({
    ...entry,
  }));
}

function buildDefaultPortalData(studentLike) {
  const key = departmentKey(studentLike.department);
  const catalog = departmentCatalog[key] || departmentCatalog.CSE;
  const semester = yearToSemester(studentLike.academicYear);

  return {
    school: catalog.school,
    program: catalog.program,
    semester,
    section: sectionFromRegNo(studentLike.regNo),
    mentorName: catalog.mentorName,
    cgpa: 8.61,
    creditsRegistered: 22,
    creditsEarned: semester === "Semester 2" ? 18 : 84,
    quickLinks: cloneEntries(sharedQuickLinks),
    spotlight: cloneEntries(sharedSpotlight),
    courses: cloneEntries(catalog.courses),
    schedule: cloneEntries(catalog.schedule),
    assessments: cloneEntries(catalog.assessments),
    assignments: cloneEntries(catalog.assignments),
  };
}

function ensureStudentPortalData(student) {
  const defaults = buildDefaultPortalData(student);
  let changed = false;

  [
    "school",
    "program",
    "semester",
    "section",
    "mentorName",
    "cgpa",
    "creditsRegistered",
    "creditsEarned",
  ].forEach((field) => {
    if (student[field] === undefined || student[field] === null || student[field] === "") {
      student[field] = defaults[field];
      changed = true;
    }
  });

  ["quickLinks", "spotlight", "courses", "schedule", "assessments", "assignments"].forEach((field) => {
    if (!Array.isArray(student[field]) || student[field].length === 0) {
      student[field] = defaults[field];
      changed = true;
    }
  });

  return changed;
}

module.exports = {
  buildDefaultPortalData,
  ensureStudentPortalData,
};
