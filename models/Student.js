const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const spotlightSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    detail: {
      type: String,
      trim: true,
    },
    audience: {
      type: String,
      trim: true,
    },
    postedOn: {
      type: Date,
    },
  },
  { _id: false }
);

const quickLinkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
    },
    shortCode: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      trim: true,
    },
    faculty: {
      type: String,
      trim: true,
    },
    slot: {
      type: String,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
    },
    attendancePercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    attendedClasses: {
      type: Number,
      min: 0,
    },
    totalClasses: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      trim: true,
    },
    startTime: {
      type: String,
      trim: true,
    },
    endTime: {
      type: String,
      trim: true,
    },
    courseCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      trim: true,
    },
    venue: {
      type: String,
      trim: true,
    },
    faculty: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    maxMarks: {
      type: Number,
      min: 0,
    },
    scoredMarks: {
      type: Number,
      min: 0,
      default: null,
    },
    weightage: {
      type: String,
      trim: true,
    },
    examDate: {
      type: Date,
    },
    status: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    trim: true,
    uppercase: true,
  },
  title: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["Pending", "Submitted", "Overdue"],
    default: "Pending",
  },
  submittedAt: {
    type: Date,
    default: null,
  },
  instructions: {
    type: String,
    trim: true,
  },
});

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    regNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "student",
    },
    school: {
      type: String,
      trim: true,
    },
    program: {
      type: String,
      trim: true,
    },
    semester: {
      type: String,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
    },
    mentorName: {
      type: String,
      trim: true,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },
    creditsRegistered: {
      type: Number,
      min: 0,
    },
    creditsEarned: {
      type: Number,
      min: 0,
    },
    spotlight: [spotlightSchema],
    quickLinks: [quickLinkSchema],
    courses: [courseSchema],
    schedule: [scheduleSchema],
    assessments: [assessmentSchema],
    assignments: [assignmentSchema],
  },
  {
    timestamps: true,
  }
);

studentSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

studentSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

studentSchema.methods.toJSON = function toJSON() {
  const student = this.toObject();
  delete student.password;
  delete student.__v;
  return student;
};

module.exports = mongoose.model("Student", studentSchema);
