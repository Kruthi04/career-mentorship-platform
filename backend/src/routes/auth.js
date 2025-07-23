const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register a new user
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

// Check if user is a mentor
router.get("/mentor-status/:userId", authController.checkMentorStatus);

module.exports = router;
