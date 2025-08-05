const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const mentorRoutes = require("./routes/mentor");
const resumeRoutes = require("./routes/resume");
const linkedInRoutes = require("./routes/linkedIn");
const sessionRoutes = require("./routes/session");
const phylloRoutes = require("./routes/phyllo");

const app = express();
const PORT = 5050;

// Create logs directory if it doesn't exist
const fs = require("fs");
const path = require("path");
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://localhost:5178",
      "http://localhost:5179",
      "http://localhost:5180",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 60 * 1000, // 30 minutes
      sameSite: "lax",
    },
    name: "careerhub_session",
  })
);

// Session validation middleware
app.use((req, res, next) => {
  // Skip session validation for login and register routes
  if (req.path === "/api/auth/login" || req.path === "/api/auth/register") {
    return next();
  }

  // Check if session exists and has userId
  if (req.session && req.session.userId) {
    const now = Date.now();
    const lastActivity = req.session.lastActivity || 0;
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Check if session has expired
    if (now - lastActivity > sessionTimeout) {
      console.log("Session expired for user:", req.session.userId);
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
      });
      return res.status(401).json({
        message: "Session expired. Please login again.",
        sessionExpired: true,
      });
    }

    // Update last activity
    req.session.lastActivity = now;
    req.session.touch(); // Extend session
  }

  next();
});

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/linkedin", linkedInRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/phyllo", phylloRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// MongoDB connection

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
