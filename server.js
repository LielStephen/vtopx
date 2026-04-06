require("dotenv").config();

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const bootstrapAdmin = require("./config/bootstrapAdmin");
const authRoutes = require("./routes/authRoutes");
const portalRoutes = require("./routes/portalRoutes");
const adminRoutes = require("./routes/adminRoutes");
const publicRoutes = require("./routes/publicRoutes");

const app = express();
const publicDir = path.join(__dirname, "public");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static(publicDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(publicDir, "dashboard.html"));
});

app.get("/academics", (req, res) => {
  res.sendFile(path.join(publicDir, "academics.html"));
});

app.get("/requests", (req, res) => {
  res.sendFile(path.join(publicDir, "requests.html"));
});

app.get("/admin/users", (req, res) => {
  res.sendFile(path.join(publicDir, "admin-users.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/portal", portalRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "student-portal" });
});

app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found." });
});

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    return bootstrapAdmin();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Student portal running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Startup failed:", error.message);
    process.exit(1);
  });
