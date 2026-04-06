const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    requestType: {
      type: String,
      required: true,
      enum: [
        "Leave Request",
        "Bonafide Certificate",
        "Revaluation",
        "Faculty Assistance",
      ],
    },
    courseCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Review", "Approved", "Closed"],
      default: "Pending",
    },
    fromDate: {
      type: Date,
      default: null,
    },
    toDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
