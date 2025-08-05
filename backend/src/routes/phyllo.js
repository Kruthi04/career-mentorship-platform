const express = require("express");
const router = express.Router();
const phylloController = require("../controllers/phylloController");
const auth = require("../middleware/auth");

// Phyllo LinkedIn verification routes
router.post(
  "/linkedin/initiate",
  auth,
  phylloController.initiateLinkedInVerification
);
router.get(
  "/linkedin/status/:userId",
  auth,
  phylloController.getLinkedInVerificationStatus
);
router.post(
  "/linkedin/verify/:userId",
  auth,
  phylloController.verifyLinkedInProfile
);

// Phyllo webhook (no auth required for webhooks)
router.post("/webhook", phylloController.handleWebhook);

module.exports = router;
