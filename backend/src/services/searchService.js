const Mentor = require("../models/Mentor");
const User = require("../models/User");
const Session = require("../models/Session");

class SearchService {
  /**
   * Search mentors with filters
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.query - Search query
   * @param {Array} searchParams.areasOfExpertise - Filter by expertise areas
   * @param {Array} searchParams.skills - Filter by skills
   * @param {number} searchParams.minExperience - Minimum years of experience
   * @param {number} searchParams.maxHourlyRate - Maximum hourly rate
   * @param {Array} searchParams.helpAreas - Filter by help areas
   * @param {number} searchParams.page - Page number for pagination
   * @param {number} searchParams.limit - Number of results per page
   */
  async searchMentors(searchParams) {
    try {
      const {
        query = "",
        areasOfExpertise = [],
        skills = [],
        minExperience = 0,
        maxHourlyRate = null,
        helpAreas = [],
        page = 1,
        limit = 10,
      } = searchParams;

      // Check if Atlas Search is available by trying a simple search first
      let useAtlasSearch = false;
      if (query.trim()) {
        try {
          // Test if Atlas Search index exists
          await Mentor.aggregate([
            {
              $search: {
                index: "mentor-search-index",
                text: {
                  query: "test",
                  path: "fullName",
                },
              },
            },
            { $limit: 1 },
          ]);
          useAtlasSearch = true;
        } catch (searchError) {
          console.log("Atlas Search not available, falling back to regular search");
          useAtlasSearch = false;
        }
      }

      // Build the search aggregation pipeline
      const pipeline = [];

      // Text search stage (only if Atlas Search is available)
      if (query.trim() && useAtlasSearch) {
        pipeline.push({
          $search: {
            index: "mentor-search-index",
            compound: {
              should: [
                {
                  text: {
                    query: query,
                    path: ["fullName", "professionalTitle", "bio"],
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 3,
                    },
                  },
                },
                {
                  autocomplete: {
                    query: query,
                    path: "fullName",
                    fuzzy: {
                      maxEdits: 1,
                      prefixLength: 2,
                    },
                  },
                },
              ],
            },
          },
        });
      }

      // Filter stage
      const matchConditions = { verified: true };

      if (areasOfExpertise.length > 0) {
        matchConditions.areasOfExpertise = { $in: areasOfExpertise };
      }

      if (skills.length > 0) {
        matchConditions.skills = { $in: skills };
      }

      if (helpAreas.length > 0) {
        matchConditions.helpAreas = { $in: helpAreas };
      }

      if (minExperience > 0) {
        matchConditions.yearsOfExperience = { $gte: minExperience };
      }

      if (maxHourlyRate) {
        matchConditions.hourlyRate = { $lte: maxHourlyRate };
      }

      // If using regular search and have a query, add text search conditions
      if (query.trim() && !useAtlasSearch) {
        matchConditions.$or = [
          { fullName: { $regex: query, $options: "i" } },
          { professionalTitle: { $regex: query, $options: "i" } },
          { bio: { $regex: query, $options: "i" } },
          { areasOfExpertise: { $in: [new RegExp(query, "i")] } },
          { skills: { $in: [new RegExp(query, "i")] } },
        ];
      }

      pipeline.push({ $match: matchConditions });

      // Add score for relevance (only if using Atlas Search)
      if (query.trim() && useAtlasSearch) {
        pipeline.push({
          $addFields: {
            searchScore: { $meta: "searchScore" },
          },
        });
      }

      // Sort by relevance (if search query and Atlas Search) or by creation date
      if (query.trim() && useAtlasSearch) {
        pipeline.push({
          $sort: {
            searchScore: { $meta: "searchScore" },
            createdAt: -1,
          },
        });
      } else {
        pipeline.push({
          $sort: { createdAt: -1 },
        });
      }

      // Pagination
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip }, { $limit: limit });

      // Execute search
      const mentors = await Mentor.aggregate(pipeline);

      // Get total count for pagination
      const countPipeline = [...pipeline.slice(0, -2)]; // Remove skip and limit
      countPipeline.push({ $count: "total" });
      const countResult = await Mentor.aggregate(countPipeline);
      const total = countResult.length > 0 ? countResult[0].total : 0;

      return {
        mentors,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
        atlasSearchEnabled: useAtlasSearch,
      };
    } catch (error) {
      console.error("Search mentors error:", error);
      throw new Error("Failed to search mentors");
    }
  }

  /**
   * Search users (mentees)
   * @param {Object} searchParams - Search parameters
   */
  async searchUsers(searchParams) {
    try {
      const { query = "", userType = [], page = 1, limit = 10 } = searchParams;

      const pipeline = [];

      // Text search stage
      if (query.trim()) {
        pipeline.push({
          $search: {
            index: "user-search-index",
            compound: {
              should: [
                {
                  text: {
                    query: query,
                    path: ["fullName", "email"],
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 3,
                    },
                  },
                },
              ],
            },
          },
        });
      }

      // Filter stage
      const matchConditions = {};
      if (userType.length > 0) {
        matchConditions.userType = { $in: userType };
      }

      pipeline.push({ $match: matchConditions });

      // Add score for relevance
      if (query.trim()) {
        pipeline.push({
          $addFields: {
            searchScore: { $meta: "searchScore" },
          },
        });
      }

      // Sort
      if (query.trim()) {
        pipeline.push({
          $sort: {
            searchScore: { $meta: "searchScore" },
            createdAt: -1,
          },
        });
      } else {
        pipeline.push({
          $sort: { createdAt: -1 },
        });
      }

      // Pagination
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip }, { $limit: limit });

      const users = await User.aggregate(pipeline);

      // Get total count
      const countPipeline = [...pipeline.slice(0, -2)];
      countPipeline.push({ $count: "total" });
      const countResult = await User.aggregate(countPipeline);
      const total = countResult.length > 0 ? countResult[0].total : 0;

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("Search users error:", error);
      throw new Error("Failed to search users");
    }
  }

  /**
   * Search sessions
   * @param {Object} searchParams - Search parameters
   */
  async searchSessions(searchParams) {
    try {
      const {
        query = "",
        status = [],
        sessionType = [],
        page = 1,
        limit = 10,
      } = searchParams;

      const pipeline = [];

      // Text search stage
      if (query.trim()) {
        pipeline.push({
          $search: {
            index: "session-search-index",
            compound: {
              should: [
                {
                  text: {
                    query: query,
                    path: ["title", "description"],
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 3,
                    },
                  },
                },
              ],
            },
          },
        });
      }

      // Filter stage
      const matchConditions = {};
      if (status.length > 0) {
        matchConditions.status = { $in: status };
      }
      if (sessionType.length > 0) {
        matchConditions.sessionType = { $in: sessionType };
      }

      pipeline.push({ $match: matchConditions });

      // Add score for relevance
      if (query.trim()) {
        pipeline.push({
          $addFields: {
            searchScore: { $meta: "searchScore" },
          },
        });
      }

      // Sort
      if (query.trim()) {
        pipeline.push({
          $sort: {
            searchScore: { $meta: "searchScore" },
            createdAt: -1,
          },
        });
      } else {
        pipeline.push({
          $sort: { createdAt: -1 },
        });
      }

      // Pagination
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip }, { $limit: limit });

      const sessions = await Session.aggregate(pipeline);

      // Get total count
      const countPipeline = [...pipeline.slice(0, -2)];
      countPipeline.push({ $count: "total" });
      const countResult = await Session.aggregate(countPipeline);
      const total = countResult.length > 0 ? countResult[0].total : 0;

      return {
        sessions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error("Search sessions error:", error);
      throw new Error("Failed to search sessions");
    }
  }

  /**
   * Get search suggestions for autocomplete
   * @param {string} query - Search query
   * @param {string} type - Type of suggestions (mentors, skills, expertise)
   */
  async getSearchSuggestions(query, type = "mentors") {
    try {
      if (!query.trim()) return [];

      switch (type) {
        case "mentors":
          return await this.getMentorSuggestions(query);
        case "skills":
          return await this.getSkillSuggestions(query);
        case "expertise":
          return await this.getExpertiseSuggestions(query);
        default:
          return [];
      }
    } catch (error) {
      console.error("Get search suggestions error:", error);
      return [];
    }
  }

  async getMentorSuggestions(query) {
    const pipeline = [
      {
        $search: {
          index: "mentor-search-index",
          autocomplete: {
            query: query,
            path: "fullName",
            fuzzy: {
              maxEdits: 1,
              prefixLength: 2,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          professionalTitle: 1,
          areasOfExpertise: 1,
        },
      },
      { $limit: 5 },
    ];

    return await Mentor.aggregate(pipeline);
  }

  async getSkillSuggestions(query) {
    const pipeline = [
      { $unwind: "$skills" },
      {
        $search: {
          index: "mentor-search-index",
          autocomplete: {
            query: query,
            path: "skills",
            fuzzy: {
              maxEdits: 1,
              prefixLength: 2,
            },
          },
        },
      },
      {
        $group: {
          _id: "$skills",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ];

    return await Mentor.aggregate(pipeline);
  }

  async getExpertiseSuggestions(query) {
    const pipeline = [
      { $unwind: "$areasOfExpertise" },
      {
        $search: {
          index: "mentor-search-index",
          autocomplete: {
            query: query,
            path: "areasOfExpertise",
            fuzzy: {
              maxEdits: 1,
              prefixLength: 2,
            },
          },
        },
      },
      {
        $group: {
          _id: "$areasOfExpertise",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ];

    return await Mentor.aggregate(pipeline);
  }

  /**
   * Get search analytics and filters
   */
  async getSearchAnalytics() {
    try {
      const [
        totalMentors,
        expertiseAreas,
        skills,
        helpAreas,
        experienceRanges,
        hourlyRateRanges,
      ] = await Promise.all([
        Mentor.countDocuments({ verified: true }),
        Mentor.aggregate([
          { $match: { verified: true } },
          { $unwind: "$areasOfExpertise" },
          {
            $group: {
              _id: "$areasOfExpertise",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 20 },
        ]),
        Mentor.aggregate([
          { $match: { verified: true } },
          { $unwind: "$skills" },
          {
            $group: {
              _id: "$skills",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 30 },
        ]),
        Mentor.aggregate([
          { $match: { verified: true } },
          { $unwind: "$helpAreas" },
          {
            $group: {
              _id: "$helpAreas",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ]),
        Mentor.aggregate([
          { $match: { verified: true } },
          {
            $group: {
              _id: null,
              minExperience: { $min: "$yearsOfExperience" },
              maxExperience: { $max: "$yearsOfExperience" },
              avgExperience: { $avg: "$yearsOfExperience" },
            },
          },
        ]),
        Mentor.aggregate([
          { $match: { verified: true } },
          {
            $group: {
              _id: null,
              minRate: { $min: "$hourlyRate" },
              maxRate: { $max: "$hourlyRate" },
              avgRate: { $avg: "$hourlyRate" },
            },
          },
        ]),
      ]);

      return {
        totalMentors,
        expertiseAreas,
        skills,
        helpAreas,
        experienceRanges: experienceRanges[0] || {},
        hourlyRateRanges: hourlyRateRanges[0] || {},
      };
    } catch (error) {
      console.error("Get search analytics error:", error);
      throw new Error("Failed to get search analytics");
    }
  }
}

module.exports = new SearchService();
