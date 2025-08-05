const express = require("express");
const router = express.Router();
const linkedInController = require("../controllers/linkedInController");
const auth = require("../middleware/auth");

// Existing LinkedIn review routes
router.post("/store", auth, linkedInController.storeLinkedInLink);
router.get("/my-reviews", auth, linkedInController.getUserLinkedInReviews);
router.get("/career-services", auth, linkedInController.getUserCareerServices);
router.get("/review/:linkedInId", auth, linkedInController.getLinkedInReview);
router.put(
  "/review/:linkedInId",
  auth,
  linkedInController.updateLinkedInReview
);
router.delete(
  "/review/:linkedInId",
  auth,
  linkedInController.deleteLinkedInReview
);

// LinkedIn OAuth routes
router.get("/auth-url/:userId", linkedInController.getLinkedInAuthUrl);
router.get("/callback", linkedInController.handleLinkedInCallback);
router.get("/status/:userId", linkedInController.getLinkedInStatus);

module.exports = router;
