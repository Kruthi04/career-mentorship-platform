const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const { upload } = require("../config/resumeUpload");
const auth = require("../middleware/auth");

// Upload resume file
router.post(
  "/upload",
  auth,
  upload.single("resume"),
  resumeController.uploadResume
);

// Store resume link
router.post("/link", auth, resumeController.storeResumeLink);

// Get user's resumes
router.get("/my-resumes", auth, resumeController.getUserResumes);

// Get user's career services
router.get("/career-services", auth, resumeController.getUserCareerServices);

// Get single resume
router.get("/:resumeId", auth, resumeController.getResume);

// Update resume
router.put("/:resumeId", auth, resumeController.updateResume);

// Delete resume
router.delete("/:resumeId", auth, resumeController.deleteResume);

// Get resume download URL
router.get("/:resumeId/download", auth, resumeController.getResumeDownloadUrl);

module.exports = router;
