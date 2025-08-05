const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const auth = require("../middleware/auth");

// Get all sessions for a user
router.get("/user", auth, sessionController.getUserSessions);

// Get all sessions for a mentor
router.get("/mentor", auth, sessionController.getMentorSessions);

// Get pending sessions for mentors to pick up
router.get("/pending", auth, sessionController.getPendingSessions);

// Create a new session from career service
router.post(
  "/from-career-service",
  auth,
  sessionController.createSessionFromCareerService
);

// Mentor picks up a pending session
router.patch(
  "/:sessionId/pickup",
  auth,
  sessionController.pickupPendingSession
);

// Update session status (mentor actions)
router.patch("/:sessionId/status", auth, sessionController.updateSessionStatus);

// Complete a session (mentor actions)
router.patch("/:sessionId/complete", auth, sessionController.completeSession);

module.exports = router;
