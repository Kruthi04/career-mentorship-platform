const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const { upload, uploadUserProfile } = require("../config/s3");

// Register a new user
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

// Logout user
router.post("/logout", authController.logout);

// Check session status
router.get("/session", authController.checkSession);

// Test endpoint to check authentication
router.get("/test", auth, (req, res) => {
  res.json({
    message: "Authentication working",
    user: req.user,
  });
});

// Check mentor status
router.get("/mentor-status/:userId", authController.checkMentorStatus);

// Get user's dashboard type
router.get("/dashboard", auth, authController.getUserDashboard);

// Get mentee details for dashboard
router.get("/mentee-details", auth, authController.getMenteeDetails);

// Update profile image
router.post(
  "/update-profile-image",
  auth,
  uploadUserProfile.single("profileImage"),
  authController.updateProfileImage
);

module.exports = router;
