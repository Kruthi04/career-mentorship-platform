const LinkedIn = require("../models/LinkedIn");
const User = require("../models/User");
const axios = require("axios");

// Store LinkedIn profile link in MongoDB
exports.storeLinkedInLink = async (req, res) => {
  try {
    console.log("=== LinkedIn Link Storage Request ===");
    console.log("User ID:", req.user.userId);
    console.log("Body:", req.body);

    const userId = req.user.userId;
    const {
      title,
      description,
      linkedInUrl,
      tags,
      industry,
      experience,
      targetRole,
      priority,
      selectedReviewer,
    } = req.body;

    // Validate required fields
    if (!linkedInUrl) {
      return res.status(400).json({
        success: false,
        message: "LinkedIn URL is required",
      });
    }

    // Validate URL format
    const urlRegex = /^https?:\/\/.+$/;
    if (!urlRegex.test(linkedInUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      });
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create LinkedIn review record
    const linkedIn = new LinkedIn({
      userId,
      title: title || `LinkedIn Review - ${new Date().toLocaleDateString()}`,
      description: description || "",
      linkedInUrl: linkedInUrl.trim(),
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      industry,
      experience,
      targetRole,
      priority,
      selectedReviewer,
    });

    await linkedIn.save();

    console.log("LinkedIn link saved to database:", linkedIn._id);

    res.status(201).json({
      success: true,
      message: "LinkedIn profile stored successfully",
      linkedIn: {
        id: linkedIn._id,
        title: linkedIn.title,
        linkedInUrl: linkedIn.linkedInUrl,
        status: linkedIn.status,
        createdAt: linkedIn.createdAt,
      },
    });
  } catch (error) {
    console.error("Error storing LinkedIn link:", error);
    res.status(500).json({
      success: false,
      message: "Error storing LinkedIn profile",
      error: error.message,
    });
  }
};

// Get user's LinkedIn reviews
exports.getUserLinkedInReviews = async (req, res) => {
  try {
    const userId = req.user.userId;

    const linkedInReviews = await LinkedIn.find({ userId })
      .sort({ createdAt: -1 })
      .populate("reviewerId", "fullName professionalTitle");

    res.json({
      success: true,
      linkedInReviews,
    });
  } catch (error) {
    console.error("Error fetching LinkedIn reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching LinkedIn reviews",
      error: error.message,
    });
  }
};

// Get user's career services (including LinkedIn reviews)
exports.getUserCareerServices = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("=== Get User Career Services ===");
    console.log("User ID:", userId);

    // Get LinkedIn reviews
    const linkedInReviews = await LinkedIn.find({ userId })
      .sort({ createdAt: -1 })
      .populate("reviewerId", "fullName professionalTitle");

    // Get Resume reviews (if you have them)
    const Resume = require("../models/Resume");
    const resumeReviews = await Resume.find({ userId })
      .sort({ createdAt: -1 })
      .populate("reviewerId", "fullName professionalTitle");

    const careerServices = [
      ...linkedInReviews.map((review) => ({
        ...review.toObject(),
        serviceType: "linkedin_review",
      })),
      ...resumeReviews.map((review) => ({
        ...review.toObject(),
        serviceType: "resume_review",
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log("Found", careerServices.length, "career services for user");

    res.json({
      success: true,
      careerServices,
    });
  } catch (error) {
    console.error("Error fetching career services:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching career services",
      error: error.message,
    });
  }
};

// Get single LinkedIn review
exports.getLinkedInReview = async (req, res) => {
  try {
    const { linkedInId } = req.params;
    const userId = req.user.userId;

    const linkedInReview = await LinkedIn.findOne({
      _id: linkedInId,
      userId,
    }).populate("reviewerId", "fullName professionalTitle");

    if (!linkedInReview) {
      return res.status(404).json({
        success: false,
        message: "LinkedIn review not found",
      });
    }

    res.json({
      success: true,
      linkedInReview,
    });
  } catch (error) {
    console.error("Error fetching LinkedIn review:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching LinkedIn review",
      error: error.message,
    });
  }
};

// Update LinkedIn review
exports.updateLinkedInReview = async (req, res) => {
  try {
    const { linkedInId } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;

    const linkedInReview = await LinkedIn.findOneAndUpdate(
      {
        _id: linkedInId,
        userId,
      },
      updateData,
      { new: true }
    );

    if (!linkedInReview) {
      return res.status(404).json({
        success: false,
        message: "LinkedIn review not found",
      });
    }

    res.json({
      success: true,
      message: "LinkedIn review updated successfully",
      linkedInReview,
    });
  } catch (error) {
    console.error("Error updating LinkedIn review:", error);
    res.status(500).json({
      success: false,
      message: "Error updating LinkedIn review",
      error: error.message,
    });
  }
};

// Delete LinkedIn review
exports.deleteLinkedInReview = async (req, res) => {
  try {
    const { linkedInId } = req.params;
    const userId = req.user.userId;

    const linkedInReview = await LinkedIn.findOneAndDelete({
      _id: linkedInId,
      userId,
    });

    if (!linkedInReview) {
      return res.status(404).json({
        success: false,
        message: "LinkedIn review not found",
      });
    }

    res.json({
      success: true,
      message: "LinkedIn review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting LinkedIn review:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting LinkedIn review",
      error: error.message,
    });
  }
};

// LinkedIn OAuth configuration
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI =
  process.env.LINKEDIN_REDIRECT_URI ||
  "http://localhost:5173/linkedin-callback";

// Generate LinkedIn OAuth URL
exports.getLinkedInAuthUrl = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Generate state parameter to prevent CSRF
    const state = Buffer.from(JSON.stringify({ userId })).toString("base64");

    const authUrl =
      `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${LINKEDIN_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&` +
      `state=${encodeURIComponent(state)}&` +
      `scope=r_liteprofile%20r_emailaddress`;

    res.json({ authUrl });
  } catch (error) {
    console.error("LinkedIn auth URL generation error:", error);
    res.status(500).json({ message: "Error generating LinkedIn auth URL" });
  }
};

// Handle LinkedIn OAuth callback
exports.handleLinkedInCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res
        .status(400)
        .json({ message: "Missing authorization code or state" });
    }

    // Decode state to get userId
    const decodedState = JSON.parse(Buffer.from(state, "base64").toString());
    const { userId } = decodedState;

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        grant_type: "authorization_code",
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: LINKEDIN_REDIRECT_URI,
      }
    );

    const { access_token } = tokenResponse.data;

    // Get user profile from LinkedIn
    const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const profile = profileResponse.data;

    // Get user's position information
    const positionResponse = await axios.get(
      "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams),positions)",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const positions = positionResponse.data.positions?.elements || [];
    const currentPosition =
      positions.find((pos) => pos.current) || positions[0];

    // Extract company and position information
    const company = currentPosition?.companyName || "Unknown Company";
    const position = currentPosition?.title || "Unknown Position";
    const headline = `${position} at ${company}`;

    // Update user with LinkedIn information
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify if the company matches (you can add more sophisticated matching logic)
    const isVerified = true; // For now, we'll mark as verified if we can get the data

    user.linkedInProfile = {
      linkedInId: profile.id,
      headline,
      company,
      position,
      profileUrl: `https://www.linkedin.com/in/${profile.id}`,
      verified: isVerified,
      verificationDate: new Date(),
    };

    await user.save();

    res.json({
      message: "LinkedIn verification completed successfully",
      verified: isVerified,
      profile: {
        headline,
        company,
        position,
      },
    });
  } catch (error) {
    console.error("LinkedIn callback error:", error);
    res.status(500).json({ message: "Error processing LinkedIn verification" });
  }
};

// Get LinkedIn verification status
exports.getLinkedInStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      hasLinkedInProfile: !!user.linkedInProfile?.linkedInId,
      verified: user.linkedInProfile?.verified || false,
      profile: user.linkedInProfile || null,
    });
  } catch (error) {
    console.error("LinkedIn status error:", error);
    res.status(500).json({ message: "Error getting LinkedIn status" });
  }
};
