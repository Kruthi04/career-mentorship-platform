const searchService = require("../services/searchService");

/**
 * Search mentors with filters
 * GET /api/search/mentors
 */
exports.searchMentors = async (req, res) => {
  try {
    const {
      q: query,
      areasOfExpertise,
      skills,
      minExperience,
      maxHourlyRate,
      helpAreas,
      page = 1,
      limit = 10,
    } = req.query;

    // Parse array parameters
    const searchParams = {
      query: query || "",
      areasOfExpertise: areasOfExpertise ? areasOfExpertise.split(",") : [],
      skills: skills ? skills.split(",") : [],
      minExperience: minExperience ? parseInt(minExperience) : 0,
      maxHourlyRate: maxHourlyRate ? parseInt(maxHourlyRate) : null,
      helpAreas: helpAreas ? helpAreas.split(",") : [],
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await searchService.searchMentors(searchParams);

    res.json({
      success: true,
      data: result.mentors,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Search mentors controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search mentors",
      error: error.message,
    });
  }
};

/**
 * Search users (mentees)
 * GET /api/search/users
 */
exports.searchUsers = async (req, res) => {
  try {
    const { q: query, userType, page = 1, limit = 10 } = req.query;

    const searchParams = {
      query: query || "",
      userType: userType ? userType.split(",") : [],
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await searchService.searchUsers(searchParams);

    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Search users controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error.message,
    });
  }
};

/**
 * Search sessions
 * GET /api/search/sessions
 */
exports.searchSessions = async (req, res) => {
  try {
    const { q: query, status, sessionType, page = 1, limit = 10 } = req.query;

    const searchParams = {
      query: query || "",
      status: status ? status.split(",") : [],
      sessionType: sessionType ? sessionType.split(",") : [],
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const result = await searchService.searchSessions(searchParams);

    res.json({
      success: true,
      data: result.sessions,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Search sessions controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search sessions",
      error: error.message,
    });
  }
};

/**
 * Get search suggestions for autocomplete
 * GET /api/search/suggestions
 */
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { q: query, type = "mentors" } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const suggestions = await searchService.getSearchSuggestions(
      query.trim(),
      type
    );

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Get search suggestions controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get search suggestions",
      error: error.message,
    });
  }
};

/**
 * Get search analytics and filters
 * GET /api/search/analytics
 */
exports.getSearchAnalytics = async (req, res) => {
  try {
    const analytics = await searchService.getSearchAnalytics();

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Get search analytics controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get search analytics",
      error: error.message,
    });
  }
};

/**
 * Global search across all content types
 * GET /api/search/global
 */
exports.globalSearch = async (req, res) => {
  try {
    const { q: query, page = 1, limit = 10 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        data: {
          mentors: [],
          users: [],
          sessions: [],
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0,
        },
      });
    }

    // Search across all content types
    const [mentorsResult, usersResult, sessionsResult] = await Promise.all([
      searchService.searchMentors({
        query: query.trim(),
        page: parseInt(page),
        limit: Math.ceil(parseInt(limit) / 3), // Distribute limit across types
      }),
      searchService.searchUsers({
        query: query.trim(),
        page: parseInt(page),
        limit: Math.ceil(parseInt(limit) / 3),
      }),
      searchService.searchSessions({
        query: query.trim(),
        page: parseInt(page),
        limit: Math.ceil(parseInt(limit) / 3),
      }),
    ]);

    const totalResults =
      mentorsResult.pagination.total +
      usersResult.pagination.total +
      sessionsResult.pagination.total;

    res.json({
      success: true,
      data: {
        mentors: mentorsResult.mentors,
        users: usersResult.users,
        sessions: sessionsResult.sessions,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalResults,
        totalPages: Math.ceil(totalResults / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Global search controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to perform global search",
      error: error.message,
    });
  }
};

