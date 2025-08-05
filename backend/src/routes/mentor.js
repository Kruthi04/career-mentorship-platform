const express = require("express");
const router = express.Router();
const mentorController = require("../controllers/mentorController");
const auth = require("../middleware/auth");
const {
  upload,
  uploadMentorProfile,
  generatePresignedUrl,
} = require("../config/s3");

// Get all verified mentors
router.get("/", mentorController.getAllMentors);

// Get verified mentors only
router.get("/verified", mentorController.getVerifiedMentors);

// Get my mentor details (for logged-in mentors) - MUST come before /:id
router.get("/my-details", auth, mentorController.getMyMentorDetails);

// Get my mentee details (for logged-in mentees)
router.get("/mentee/my-details", auth, mentorController.getMyMenteeDetails);

// Get mentor details
router.get("/:id", mentorController.getMentorDetails);

// Get mentors by help area
router.get("/help-area/:helpArea", mentorController.getMentorsByHelpArea);

// Apply to become a mentor with verification
router.post("/apply", auth, mentorController.applyToBecomeMentor);

// Register as a new mentor (for new users)
router.post(
  "/register",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "idVerification", maxCount: 1 },
  ]),
  mentorController.registerMentor
);

// Verify email token
router.get("/verify-email/:token", mentorController.verifyEmail);

// Resend verification email
router.post(
  "/resend-verification/:mentorId",
  auth,
  mentorController.resendVerificationEmail
);

// Upload profile image
router.post(
  "/profile-image",
  auth,
  uploadMentorProfile.single("profileImage"),
  mentorController.updateProfileImage
);

// Get file URL (for S3 files)
router.get("/file/:fileKey", async (req, res) => {
  try {
    const { fileKey } = req.params;
    const presignedUrl = await generatePresignedUrl(fileKey);
    res.json({ url: presignedUrl });
  } catch (error) {
    res.status(500).json({ message: "Error generating file URL" });
  }
});

module.exports = router;
