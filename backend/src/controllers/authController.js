const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Utility function to capitalize first letter of each word in a name
const capitalizeName = (name) => {
  if (!name) return name;
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Register a new user
exports.register = async (req, res) => {
  console.log("✅ Register route hit with data:", req.body);
  try {
    const { name, email, password, userType, wantsLinkedInVerification } =
      req.body;

    // Capitalize the name
    const capitalizedName = capitalizeName(name);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine if user is a mentor based on userType
    const isMentor = userType === "mentor" || userType === "both";

    // Create user with capitalized name and user type
    const user = new User({
      name: capitalizedName,
      email,
      password: hashedPassword,
      userType: userType || "mentee",
      isMentor,
    });
    await user.save();

    // If user wants LinkedIn verification and is a mentor, redirect to LinkedIn OAuth
    if (wantsLinkedInVerification && isMentor) {
      return res.status(201).json({
        message: "User registered successfully",
        needsLinkedInVerification: true,
        userId: user._id,
      });
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔍 Login attempt:", {
      email,
      password: password ? "***" : "undefined",
    });

    const user = await User.findOne({ email });
    console.log("👤 User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("🔐 Comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password doesn't match for user:", user.email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create session
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.isMentor = user.isMentor;
    req.session.lastActivity = Date.now();

    // Create JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, isMentor: user.isMentor },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isMentor: user.isMentor,
        mentorId: user.mentorId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    console.log("🔓 Logout attempt for user:", req.session.userId);

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Error logging out" });
      }

      console.log("✅ User logged out successfully");
      res.json({ message: "Logged out successfully" });
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Check session status
exports.checkSession = async (req, res) => {
  try {
    if (req.session && req.session.userId) {
      const now = Date.now();
      const lastActivity = req.session.lastActivity || 0;
      const sessionTimeout = 30 * 60 * 1000; // 30 minutes
      const timeRemaining = sessionTimeout - (now - lastActivity);

      res.json({
        isLoggedIn: true,
        userId: req.session.userId,
        email: req.session.email,
        isMentor: req.session.isMentor,
        lastActivity: req.session.lastActivity,
        timeRemaining: Math.max(0, timeRemaining),
        sessionTimeout: sessionTimeout,
      });
    } else {
      res.json({ isLoggedIn: false });
    }
  } catch (err) {
    console.error("Check session error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Check if user is a mentor
exports.checkMentorStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      isMentor: user.isMentor,
      mentorId: user.mentorId,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get user's dashboard type
exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("mentorId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has a mentor application
    const Mentor = require("../models/Mentor");
    const mentorApplication = await Mentor.findOne({ userId: user._id });

    let dashboardType = "user"; // Default dashboard
    let mentorData = null;

    if (user.isMentor && user.mentorId && user.mentorId.verified) {
      // User is a verified mentor
      dashboardType = "mentor";
      mentorData = user.mentorId;
    } else if (mentorApplication && !mentorApplication.verified) {
      // User has applied but not verified yet
      dashboardType = "mentor-pending";
      mentorData = mentorApplication;
    } else if (user.isMentor && user.mentorId && !user.mentorId.verified) {
      // User is marked as mentor but not verified
      dashboardType = "mentor-pending";
      mentorData = user.mentorId;
    }

    res.json({
      dashboardType,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isMentor: user.isMentor,
        mentorId: user.mentorId,
      },
      mentorData,
    });
  } catch (err) {
    console.error("Get user dashboard error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get mentee details for dashboard
exports.getMenteeDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("=== getMenteeDetails Debug ===");
    console.log("User ID:", userId);
    console.log("User profileImage:", user.profileImage);

    // Generate profile image URL if it exists
    let profileImageUrl = null;
    if (user.profileImage) {
      const { getS3Url } = require("../config/s3");
      console.log("Generating URL for file key:", user.profileImage);
      profileImageUrl = await getS3Url(user.profileImage);
      console.log("Generated URL:", profileImageUrl);
    } else {
      console.log("No profile image found");
    }
    console.log("=================================");

    // Mock data for now - in a real app, this would come from the database
    const menteeData = {
      mentee: {
        _id: user._id,
        fullName: user.name,
        email: user.email,
        profileImage: profileImageUrl,
        joinDate: user.createdAt,
        preferences: [],
      },
      stats: {
        totalSessions: 0,
        completedSessions: 0,
        upcomingSessions: 0,
        totalMentors: 0,
        averageRating: 0,
        totalSpent: 0,
      },
      upcomingSessions: [],
      pendingSessions: [],
      completedSessions: [],
      mentorsWorkedWith: [],
      notifications: [],
    };

    res.json(menteeData);
  } catch (err) {
    console.error("Get mentee details error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update profile image
exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    console.log("=== updateProfileImage Debug ===");
    console.log("User ID:", userId);
    console.log("Current user.profileImage:", user.profileImage);
    console.log("req.file:", {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      filename: req.file.filename,
      key: req.file.key,
      location: req.file.location,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Delete old profile image if it exists
    if (user.profileImage) {
      const { deleteFileFromS3 } = require("../config/s3");
      // The profileImage is now stored as a file key, not a URL
      const oldFileKey = user.profileImage;
      console.log("Deleting old file key:", oldFileKey);
      await deleteFileFromS3(oldFileKey);

      // Clear cache for old image
      if (global.clearProfileImageCache) {
        global.clearProfileImageCache(oldFileKey);
      }
    }

    // Store the file key in the database (not the full URL)
    const fileKey = req.file.key || req.file.filename;
    console.log("Saving file key to database:", fileKey);
    user.profileImage = fileKey;
    await user.save();
    console.log("User saved with new profileImage:", user.profileImage);

    // Generate the full URL for the response
    const { getS3Url } = require("../config/s3");
    const fileUrl = await getS3Url(fileKey);
    console.log("Generated file URL:", fileUrl);
    console.log("=================================");

    res.json({
      message: "Profile image updated successfully",
      profileImage: fileUrl,
    });
  } catch (err) {
    console.error("Update profile image error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
