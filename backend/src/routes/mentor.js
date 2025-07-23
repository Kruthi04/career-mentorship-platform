const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
const auth = require("../middleware/auth");

// Register a new mentor (with file uploads)
router.post(
  "/register",
  mentorController.upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "idVerification", maxCount: 1 },
  ]),
  mentorController.registerMentor
);

// Test upload endpoint for debugging
router.post(
  "/test-upload",
  mentorController.upload.single("profileImage"),
  mentorController.testUpload
);

// Get mentor details by user ID (for dashboard)
router.get("/details/:userId", mentorController.getMentorDetails);

// Get current user's mentor details (using JWT)
router.get("/my-details", auth, mentorController.getMyMentorDetails);

// Get all verified mentors (for public display)
router.get("/verified", mentorController.getVerifiedMentors);

// Admin: Get all mentors (verified and unverified)
router.get("/all", mentorController.getAllMentors);

// Admin: Verify a mentor
router.patch("/verify/:mentorId", mentorController.verifyMentor);

// Update mentor profile image
router.patch(
  "/profile-image",
  auth,
  mentorController.upload.single("profileImage"),
  mentorController.updateProfileImage
);

module.exports = router;
