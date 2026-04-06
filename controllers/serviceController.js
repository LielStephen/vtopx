const ServiceRequest = require("../models/ServiceRequest");

const serviceCatalog = [
  {
    name: "NLP Answer Evaluation",
    description: "Submit exam answers for automated semantic scoring through the evaluator workflow.",
    actionLabel: "Request Evaluation",
  },
  {
    name: "Result Review",
    description: "Ask for result clarification when you want marks, comments, or extracted OCR text reviewed.",
    actionLabel: "Review Result",
  },
  {
    name: "Revaluation Support",
    description: "Send a formal revaluation request for descriptive answers that need faculty attention.",
    actionLabel: "Start Revaluation",
  },
  {
    name: "Faculty Assistance",
    description: "Raise a support request when you need guidance on submissions, uploads, or portal access.",
    actionLabel: "Contact Support",
  },
];

const allowedServiceTypes = serviceCatalog.map((service) => service.name);

function buildStats(requests) {
  return {
    total: requests.length,
    pending: requests.filter((request) => request.status === "Pending").length,
    inReview: requests.filter((request) => request.status === "In Review").length,
    completed: requests.filter((request) => request.status === "Completed").length,
  };
}

async function getCatalog(req, res) {
  return res.json({ services: serviceCatalog });
}

async function getRequests(req, res) {
  const requests = await ServiceRequest.find({ student: req.student._id })
    .sort({ createdAt: -1 })
    .lean();

  return res.json({
    stats: buildStats(requests),
    requests,
  });
}

async function createRequest(req, res) {
  try {
    const { serviceType, courseCode, title, description } = req.body;

    if (!serviceType || !courseCode || !title || !description) {
      return res.status(400).json({ message: "Complete all service request fields." });
    }

    if (!allowedServiceTypes.includes(serviceType)) {
      return res.status(400).json({ message: "Choose a valid backend service." });
    }

    const request = await ServiceRequest.create({
      student: req.student._id,
      serviceType,
      courseCode,
      title,
      description,
    });

    return res.status(201).json({
      message: "Service request submitted successfully.",
      request,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not submit the service request." });
  }
}

module.exports = {
  getCatalog,
  getRequests,
  createRequest,
};
