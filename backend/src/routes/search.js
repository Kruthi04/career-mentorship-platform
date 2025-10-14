const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const auth = require("../middleware/auth");

// Public search routes (no authentication required)
router.get("/mentors", searchController.searchMentors);
router.get("/suggestions", searchController.getSearchSuggestions);
router.get("/analytics", searchController.getSearchAnalytics);
router.get("/global", searchController.globalSearch);

// Protected search routes (authentication required)
router.get("/users", auth, searchController.searchUsers);
router.get("/sessions", auth, searchController.searchSessions);

module.exports = router;

