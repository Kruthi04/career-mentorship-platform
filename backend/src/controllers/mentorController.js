const Mentor = require("../models/Mentor");
const User = require("../models/User");
const Session = require("../models/Session");
const Review = require("../models/Review");
const bcrypt = require("bcryptjs");
const { upload, deleteFileFromS3, getS3Url } = require("../config/s3");

// Register a new mentor
exports.registerMentor = async (req, res) => {
  try {
    const {
      fullName,
      professionalTitle,
      location,
      bio,
      areasOfExpertise,
      skills,
      yearsOfExperience,
      languagesSpoken,
      linkedInUrl,
      personalWebsite,
      hourlyRate,
      offerFreeIntro,
      helpAreas,
      sessionDuration,
      availability,
      email,
      password,
      existingUserId,
    } = req.body;

    // Validate required fields
    if (!fullName || !professionalTitle || !location || !bio || !linkedInUrl) {
      return res.status(400).json({
        message:
          "Missing required fields: fullName, professionalTitle, location, bio, linkedInUrl",
      });
    }

    // Validate ID verification file is uploaded
    if (!req.files?.idVerification) {
      return res.status(400).json({
        message:
          "ID verification document is required. Please upload a government ID or passport.",
      });
    }

    let user;

    // Handle existing user vs new user
    if (existingUserId) {
      // Existing user wants to become a mentor
      user = await User.findById(existingUserId);
      if (!user) {
        return res.status(404).json({
          message: "User not found. Please log in again.",
        });
      }

      // Check if user is already a mentor
      if (user.isMentor) {
        return res.status(400).json({
          message: "You are already registered as a mentor.",
        });
      }
    } else {
      // New user registration
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required for new users.",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message:
            "User with this email already exists. Please sign in instead.",
        });
      }
    }

    // Handle file uploads
    const profileImage = req.files?.profileImage
      ? req.files.profileImage[0].key // S3 key
      : null;
    const idVerification = req.files.idVerification[0].key; // S3 key

    // Parse arrays from form data
    const expertiseArray = areasOfExpertise
      ? areasOfExpertise
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item)
      : [];
    const skillsArray = skills
      ? skills
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item)
      : [];
    const languagesArray = languagesSpoken
      ? languagesSpoken
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item)
      : [];
    const helpAreasArray = helpAreas
      ? helpAreas
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item)
      : [];
    const availabilityArray = availability
      ? availability
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item)
      : [];

    // Create mentor profile
    const mentor = new Mentor({
      fullName,
      profileImage,
      professionalTitle,
      location,
      bio,
      areasOfExpertise: expertiseArray,
      skills: skillsArray,
      yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : 0,
      languagesSpoken: languagesArray,
      linkedInUrl,
      personalWebsite: personalWebsite || "",
      idVerification,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 0,
      offerFreeIntro: offerFreeIntro === "true",
      helpAreas: helpAreasArray,
      sessionDuration: sessionDuration || "60",
      availability: availabilityArray,
      verified: false,
    });

    await mentor.save();

    if (existingUserId) {
      // Update existing user to be a mentor
      user.mentorId = mentor._id;
      user.isMentor = true;
      await user.save();
    } else {
      // Create new user account
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        name: fullName,
        email,
        password: hashedPassword,
        mentorId: mentor._id,
        isMentor: true,
      });

      await user.save();
    }

    res.status(201).json({
      message:
        "Mentor registration submitted successfully. Awaiting verification.",
      mentorId: mentor._id,
      userId: user._id,
    });
  } catch (err) {
    console.error("Mentor registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all verified mentors
exports.getVerifiedMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ verified: true });

    // Convert S3 keys to URLs for each mentor
    const mentorsWithUrls = mentors.map((mentor) => ({
      ...mentor.toObject(),
      profileImage: getS3Url(mentor.profileImage),
    }));

    res.json(mentorsWithUrls);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Verify a mentor
exports.verifyMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const mentor = await Mentor.findByIdAndUpdate(
      mentorId,
      { verified: true },
      { new: true }
    );
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.json({ message: "Mentor verified successfully", mentor });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Get all mentors (verified and unverified)
exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().sort({ createdAt: -1 });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get mentor details by user ID
exports.getMentorDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Fetching mentor details for userId:", userId);

    // First try to find the user and populate mentor details
    let user = await User.findById(userId).populate("mentorId");

    console.log("User found:", user ? "Yes" : "No");
    if (user) {
      console.log("User isMentor:", user.isMentor);
      console.log("User mentorId:", user.mentorId);
    }

    let mentor;

    if (!user) {
      // If no user found, try to find a mentor directly with this ID
      console.log("No user found, trying to find mentor directly");
      mentor = await Mentor.findById(userId);

      if (!mentor) {
        return res.status(404).json({ message: "User or mentor not found" });
      }

      console.log("Mentor found directly:", mentor.fullName);
    } else {
      if (!user.isMentor || !user.mentorId) {
        return res.status(404).json({ message: "User is not a mentor" });
      }
      mentor = user.mentorId;
    }

    console.log("Mentor data:", mentor);

    // Calculate some basic stats (these would be calculated from actual data in a real app)
    const stats = {
      upcomingSessions: 3, // This would come from sessions collection
      averageRating: 4.9, // This would come from reviews collection
      totalEarnings: 750, // This would come from earnings collection
      totalSessions: 12,
      totalReviews: 8,
    };

    // Get recent sessions (mock data for now)
    const upcomingSessions = [
      {
        id: 1,
        title: "Career Guidance Session",
        menteeName: "John Smith",
        date: "Today",
        time: "3:00 PM - 4:00 PM",
        platform: "Zoom Meeting",
        status: "upcoming",
      },
      {
        id: 2,
        title: "Resume Review",
        menteeName: "Emily Chen",
        date: "Tomorrow",
        time: "10:00 AM - 10:30 AM",
        platform: "Google Meet",
        status: "upcoming",
      },
      {
        id: 3,
        title: "Technical Interview Prep",
        menteeName: "Michael Wong",
        date: "Fri, Jun 10",
        time: "2:00 PM - 3:30 PM",
        platform: "Zoom Meeting",
        status: "upcoming",
      },
    ];

    // Get recent reviews (mock data for now)
    const recentReviews = [
      {
        id: 1,
        reviewerName: "Alex Johnson",
        reviewerImage: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        comment:
          "Sarah was incredibly helpful with my career transition questions. Her insights about the industry were invaluable, and she provided actionable advice that I could implement right away.",
        date: "2 days ago",
      },
      {
        id: 2,
        reviewerName: "Rebecca Liu",
        reviewerImage: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        comment:
          "The resume review session was exactly what I needed. Sarah's feedback helped me highlight my achievements better, and I've already gotten more interview requests since updating it!",
        date: "1 week ago",
      },
    ];

    // Get notifications (mock data for now)
    const notifications = [
      {
        id: 1,
        type: "session_request",
        title: "New session request",
        message: "from David Wilson for tomorrow at 2:00 PM.",
        icon: "bell",
        color: "blue",
        date: "2 hours ago",
      },
      {
        id: 2,
        type: "review",
        title: "New review",
        message: "from Alex Johnson. They rated your session 5 stars!",
        icon: "star",
        color: "yellow",
        date: "2 days ago",
      },
      {
        id: 3,
        type: "payment",
        title: "Payment received",
        message: "for your session with Rebecca Liu.",
        icon: "dollar",
        color: "green",
        date: "1 week ago",
      },
    ];

    const responseData = {
      success: true,
      mentor: {
        _id: mentor._id,
        fullName: mentor.fullName,
        email: user ? user.email : "mentor@example.com", // Use user email if available
        title: mentor.professionalTitle,
        industry: mentor.areasOfExpertise?.[0] || "Technology",
        experience: mentor.yearsOfExperience,
        bio: mentor.bio,
        profileImage: mentor.profileImage,
        verificationStatus: mentor.verified ? "verified" : "pending",
        hourlyRate: mentor.hourlyRate,
        specialties: mentor.areasOfExpertise,
        skills: mentor.skills,
      },
      stats,
      upcomingSessions,
      recentReviews,
      notifications,
    };

    console.log("Sending response:", responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching mentor details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get mentor details by JWT token (for current user)
exports.getMyMentorDetails = async (req, res) => {
  try {
    // The user ID comes from the JWT token via middleware
    const userId = req.user.userId;

    console.log("Fetching mentor details for current user:", userId);

    // Find the user and populate mentor details
    const user = await User.findById(userId).populate("mentorId");

    console.log("User found:", user ? "Yes" : "No");
    if (user) {
      console.log("User isMentor:", user.isMentor);
      console.log("User mentorId:", user.mentorId);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isMentor || !user.mentorId) {
      return res.status(404).json({ message: "User is not a mentor" });
    }

    const mentor = user.mentorId;
    console.log("Mentor data:", mentor);

    // Fetch real data from database
    const mentorId = mentor._id;

    // Get upcoming sessions (scheduled sessions in the future)
    const upcomingSessions = await Session.find({
      mentorId: mentorId,
      status: "scheduled",
      date: { $gte: new Date() },
    })
      .populate("menteeId", "name email")
      .sort({ date: 1 })
      .limit(5);

    // Get recent reviews
    const recentReviews = await Review.find({
      mentorId: mentorId,
      isPublic: true,
    })
      .populate("menteeId", "name")
      .populate("sessionId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate stats
    const totalSessions = await Session.countDocuments({ mentorId: mentorId });
    const completedSessions = await Session.countDocuments({
      mentorId: mentorId,
      status: "completed",
    });

    // Calculate average rating
    const reviews = await Review.find({ mentorId: mentorId });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    // Calculate total earnings
    const completedSessionsData = await Session.find({
      mentorId: mentorId,
      status: "completed",
    });
    const totalEarnings = completedSessionsData.reduce(
      (sum, session) => sum + session.totalAmount,
      0
    );

    const stats = {
      upcomingSessions: upcomingSessions.length,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalEarnings: totalEarnings,
      totalSessions: totalSessions,
      totalReviews: reviews.length,
    };

    // Format upcoming sessions for frontend
    const formattedUpcomingSessions = upcomingSessions.map((session) => ({
      id: session._id,
      title: session.title,
      menteeName: session.menteeId?.name || "Unknown",
      date: session.date.toLocaleDateString(),
      time: session.date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      platform: session.platform,
      status: session.status,
    }));

    // Format recent reviews for frontend
    const formattedRecentReviews = recentReviews.map((review) => ({
      id: review._id,
      reviewerName: review.menteeId?.name || "Anonymous",
      reviewerImage: `https://randomuser.me/api/portraits/men/${Math.floor(
        Math.random() * 100
      )}.jpg`, // Placeholder
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt.toLocaleDateString(),
    }));

    const responseData = {
      success: true,
      mentor: {
        _id: mentor._id,
        fullName: mentor.fullName,
        email: user ? user.email : "mentor@example.com", // Use user email if available
        title: mentor.professionalTitle,
        industry: mentor.areasOfExpertise?.[0] || "Technology",
        experience: mentor.yearsOfExperience,
        bio: mentor.bio,
        profileImage: getS3Url(mentor.profileImage), // Convert S3 key to URL
        verificationStatus: mentor.verified ? "verified" : "pending",
        hourlyRate: mentor.hourlyRate,
        specialties: mentor.areasOfExpertise,
        skills: mentor.skills,
      },
      stats,
      upcomingSessions: formattedUpcomingSessions,
      recentReviews: formattedRecentReviews,
      notifications: [], // Will be implemented later
    };

    console.log("Sending response:", responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching mentor details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update mentor profile image
exports.updateProfileImage = async (req, res) => {
  try {
    console.log("updateProfileImage called");
    console.log("Request user:", req.user);
    console.log("Request file:", req.file);
    console.log("Request files:", req.files);
    console.log("Request headers:", req.headers);

    const userId = req.user.userId;
    console.log("User ID:", userId);

    // Find the user and populate mentor details
    const user = await User.findById(userId).populate("mentorId");
    console.log("User found:", user ? "Yes" : "No");

    if (!user || !user.isMentor || !user.mentorId) {
      console.log("User validation failed");
      return res.status(404).json({ message: "User is not a mentor" });
    }

    if (!req.file) {
      console.log("No file provided");
      return res.status(400).json({ message: "No image file provided" });
    }

    console.log("File details:", {
      filename: req.file.key, // S3 key
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      location: req.file.location, // S3 URL
    });

    const mentor = user.mentorId;

    // Delete old profile image from S3 if it exists
    if (mentor.profileImage) {
      const oldFileKey = mentor.profileImage.replace(/^https:\/\/[^\/]+\//, "");
      await deleteFileFromS3(oldFileKey);
    }

    // Store the S3 key in the database
    const s3Key = req.file.key;
    mentor.profileImage = s3Key;
    await mentor.save();
    console.log("Mentor profile image updated successfully");

    // Get the full S3 URL for the frontend
    const s3Url = getS3Url(s3Key);

    res.json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: s3Url, // Return the full S3 URL
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Test endpoint for debugging
exports.testUpload = async (req, res) => {
  try {
    console.log("Test upload endpoint called");
    console.log("Request method:", req.method);
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request files:", req.files);

    res.json({
      success: true,
      message: "Test endpoint working",
      hasFile: !!req.file,
      hasFiles: !!req.files,
      body: req.body,
    });
  } catch (error) {
    console.error("Test upload error:", error);
    res.status(500).json({ message: "Test error", error: error.message });
  }
};

// Export upload middleware
exports.upload = upload;
