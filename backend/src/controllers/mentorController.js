const Mentor = require("../models/Mentor");
const User = require("../models/User");
const Session = require("../models/Session");
const Review = require("../models/Review");
const bcrypt = require("bcryptjs");
const { upload, deleteFileFromS3, getS3Url } = require("../config/s3");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Profile image URL cache to avoid repeated S3 API calls
const profileImageCache = new Map();

// Cache TTL in milliseconds (30 minutes)
const CACHE_TTL = 30 * 60 * 1000;

// Helper function to get cached profile image URL
const getCachedProfileImageUrl = async (fileKey) => {
  if (!fileKey) return null;

  const cacheKey = `profile_${fileKey}`;
  const cached = profileImageCache.get(cacheKey);

  // Check if cache exists and is not expired
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Using cached profile image URL for:", fileKey);
    return cached.url;
  }

  // Generate new URL and cache it
  const { getS3Url } = require("../config/s3");
  console.log("Generating new profile image URL for:", fileKey);
  const url = await getS3Url(fileKey);

  // Cache the URL with timestamp
  profileImageCache.set(cacheKey, {
    url,
    timestamp: Date.now(),
  });

  console.log("Cached new profile image URL for:", fileKey);
  return url;
};

// Helper function to clear cache when profile image is updated
const clearProfileImageCache = (fileKey) => {
  if (fileKey) {
    const cacheKey = `profile_${fileKey}`;
    profileImageCache.delete(cacheKey);
    console.log("Cleared profile image cache for:", fileKey);
  }
};

// Make cache clearing function globally available
global.clearProfileImageCache = clearProfileImageCache;

// Utility function to capitalize first letter of each word in a name
const capitalizeName = (name) => {
  if (!name) return name;
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Register a new mentor
exports.registerMentor = async (req, res) => {
  try {
    console.log("=== Mentor Registration Debug ===");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("Content-Type:", req.headers["content-type"]);

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

    // Capitalize the full name
    const capitalizedFullName = capitalizeName(fullName);

    console.log("Parsed fields:", {
      fullName: capitalizedFullName,
      professionalTitle,
      location,
      bio,
      linkedInUrl,
      email,
      existingUserId,
    });

    // Validate required fields
    if (
      !capitalizedFullName ||
      !professionalTitle ||
      !location ||
      !bio ||
      !linkedInUrl
    ) {
      console.log("Missing required fields");
      return res.status(400).json({
        message:
          "Missing required fields: fullName, professionalTitle, location, bio, linkedInUrl",
      });
    }

    // Validate ID verification file is uploaded
    if (!req.files?.idVerification) {
      console.log("Missing ID verification file");
      return res.status(400).json({
        message:
          "ID verification document is required. Please upload a government ID or passport.",
      });
    }

    console.log("All validations passed, proceeding with registration...");

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
      ? req.files.profileImage[0].key || req.files.profileImage[0].filename // S3 key or local filename
      : null;
    const idVerification =
      req.files.idVerification[0].key || req.files.idVerification[0].filename; // S3 key or local filename

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
      fullName: capitalizedFullName,
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
        name: capitalizedFullName,
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

    console.log("Mentor registration completed successfully");
    console.log("Mentor ID:", mentor._id);
    console.log("User ID:", user._id);
  } catch (err) {
    console.error("Mentor registration error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LinkedIn verification function
const verifyLinkedInProfile = async (linkedInUrl) => {
  try {
    // Basic URL validation
    if (!linkedInUrl.includes("linkedin.com/in/")) {
      return { isValid: false, reason: "Invalid LinkedIn URL format" };
    }

    // Extract LinkedIn username from URL
    const linkedInUsername = linkedInUrl
      .split("linkedin.com/in/")[1]
      ?.split("/")[0];
    if (!linkedInUsername) {
      return { isValid: false, reason: "Could not extract LinkedIn username" };
    }

    // For now, we'll do basic validation
    // In production, you'd want to use LinkedIn API with proper authentication
    const isValidFormat = /^[a-zA-Z0-9-]+$/.test(linkedInUsername);

    return {
      isValid: isValidFormat,
      reason: isValidFormat
        ? "LinkedIn profile format is valid"
        : "Invalid LinkedIn username format",
      username: linkedInUsername,
    };
  } catch (error) {
    console.error("LinkedIn verification error:", error);
    return { isValid: false, reason: "Error verifying LinkedIn profile" };
  }
};

// Email verification functions
const sendVerificationEmail = async (email, verificationToken, mentorName) => {
  try {
    // Create transporter with no-reply email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "your-email@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "your-app-password",
      },
    });

    // Email content
    const verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"CareerHub" <${
        process.env.EMAIL_USER || "no-reply@careerhub.com"
      }>`,
      to: email,
      subject: "Verify Your Mentor Account - CareerHub",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Welcome to CareerHub, ${mentorName}!</h2>
          <p>Thank you for applying to become a mentor. To complete your verification, please click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify My Account
            </a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated email from CareerHub. Please do not reply to this email.
            If you have questions, contact us at support@careerhub.com
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Apply to become a mentor with verification
exports.applyToBecomeMentor = async (req, res) => {
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
      idVerification, // Add this required field
      hourlyRate,
      offerFreeIntro,
      helpAreas,
      sessionDuration,
      availability,
    } = req.body;

    // Verify LinkedIn profile
    const linkedInVerification = await verifyLinkedInProfile(linkedInUrl);
    if (!linkedInVerification.isValid) {
      return res.status(400).json({
        message: "LinkedIn verification failed",
        reason: linkedInVerification.reason,
      });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create mentor with pending verification
    const mentor = new Mentor({
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
      idVerification, // Include the required field
      hourlyRate,
      offerFreeIntro,
      helpAreas,
      sessionDuration,
      availability,
      verified: false, // Will be set to true after email verification
      verificationToken,
      tokenExpiry,
      linkedInVerified: true, // LinkedIn is already verified
      emailVerified: false,
      userId: req.user.userId, // Add user ID from auth
      email: req.user.email, // Add email from auth
    });

    await mentor.save();

    // Update the User model to mark them as a mentor and link the mentor record
    const User = require("../models/User");
    await User.findByIdAndUpdate(req.user.userId, {
      isMentor: true,
      mentorId: mentor._id,
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(
      req.user.email,
      verificationToken,
      fullName
    );

    if (!emailResult.success) {
      // If email fails, still save the mentor but notify about email issue
      return res.status(201).json({
        message:
          "Mentor application submitted successfully, but verification email could not be sent",
        mentorId: mentor._id,
        emailError: emailResult.error,
      });
    }

    res.status(201).json({
      message:
        "Mentor application submitted successfully. Please check your email to verify your account.",
      mentorId: mentor._id,
    });
  } catch (error) {
    console.error("Mentor application error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify email token
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find mentor with this token
    const mentor = await Mentor.findOne({
      verificationToken: token,
      tokenExpiry: { $gt: new Date() },
    });

    if (!mentor) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    // Update mentor verification status
    mentor.verified = true;
    mentor.emailVerified = true;
    mentor.verificationToken = undefined;
    mentor.tokenExpiry = undefined;
    await mentor.save();

    // Update user's mentor status
    const user = await User.findById(mentor.userId);
    if (user) {
      user.isMentor = true;
      user.mentorId = mentor._id;
      await user.save();
    }

    res.json({
      message:
        "Email verified successfully! Your mentor account is now active.",
      mentorId: mentor._id,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Resend verification email
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    if (mentor.emailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    mentor.verificationToken = verificationToken;
    mentor.tokenExpiry = tokenExpiry;
    await mentor.save();

    // Send new verification email
    const emailResult = await sendVerificationEmail(
      mentor.email || req.user.email,
      verificationToken,
      mentor.fullName
    );

    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send verification email",
        error: emailResult.error,
      });
    }

    res.json({
      message: "Verification email sent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all verified mentors
exports.getVerifiedMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ verified: true });

    // Convert S3 keys to URLs for each mentor
    const mentorsWithUrls = await Promise.all(
      mentors.map(async (mentor) => ({
        ...mentor.toObject(),
        profileImage: await getS3Url(mentor.profileImage),
      }))
    );

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

    // Convert S3 keys to URLs for each mentor
    const mentorsWithUrls = await Promise.all(
      mentors.map(async (mentor) => ({
        ...mentor.toObject(),
        profileImage: await getS3Url(mentor.profileImage),
      }))
    );

    res.json(mentorsWithUrls);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get verified mentors only
exports.getVerifiedMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ verified: true }).sort({
      createdAt: -1,
    });

    // Convert S3 keys to URLs for each mentor
    const mentorsWithUrls = await Promise.all(
      mentors.map(async (mentor) => ({
        ...mentor.toObject(),
        profileImage: await getS3Url(mentor.profileImage),
      }))
    );

    res.json(mentorsWithUrls);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get mentors by help area
exports.getMentorsByHelpArea = async (req, res) => {
  try {
    const { helpArea } = req.params;

    console.log("=== getMentorsByHelpArea Debug ===");
    console.log("Help area requested:", helpArea);

    if (!helpArea) {
      return res.status(400).json({
        message: "Help area parameter is required",
      });
    }

    // Map help area names to areas of expertise
    const helpAreaToExpertiseMap = {
      "Software Development": "software-development",
      "Data Science": "data-science",
      Business: "business",
      Marketing: "marketing",
      Design: "design",
      Finance: "finance",
      Healthcare: "healthcare",
      Education: "education",
    };

    const expertiseArea = helpAreaToExpertiseMap[helpArea] || helpArea;
    console.log("Mapped expertise area:", expertiseArea);

    const query = {
      $or: [
        { helpAreas: { $in: [helpArea] } },
        { areasOfExpertise: { $in: [expertiseArea] } },
      ],
      // verified: true, // Temporarily commented out for testing
    };

    console.log("Query:", JSON.stringify(query, null, 2));

    const mentors = await Mentor.find(query).select(
      "fullName professionalTitle profileImage bio areasOfExpertise skills yearsOfExperience hourlyRate offerFreeIntro sessionDuration availability rating reviews"
    );

    console.log("Found mentors:", mentors.length);
    console.log(
      "Mentors:",
      mentors.map((m) => ({ name: m.fullName, expertise: m.areasOfExpertise }))
    );

    res.json(mentors);
  } catch (error) {
    console.error("Error fetching mentors by help area:", error);
    res.status(500).json({
      message: "Error fetching mentors",
    });
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

    const mentorData = user.mentorId;
    console.log("Mentor data:", mentorData);

    // Generate profile image URL if it exists
    let profileImageUrl = null;
    if (mentorData.profileImage) {
      const { getS3Url } = require("../config/s3");
      profileImageUrl = await getS3Url(mentorData.profileImage);
    }

    const response = {
      success: true,
      mentor: {
        _id: mentorData._id,
        fullName: mentorData.fullName,
        email: user.email,
        title: mentorData.professionalTitle,
        industry: mentorData.areasOfExpertise?.[0] || "general",
        experience: mentorData.yearsOfExperience,
        bio: mentorData.bio,
        profileImage: profileImageUrl,
        verificationStatus: mentorData.verified ? "verified" : "pending",
        hourlyRate: mentorData.hourlyRate || 0,
        specialties: mentorData.areasOfExpertise || [],
        skills: mentorData.skills || [],
      },
      stats: {
        upcomingSessions: 0,
        averageRating: 0,
        totalEarnings: 0,
        totalSessions: 0,
        totalReviews: 0,
      },
      upcomingSessions: [],
      recentReviews: [],
      notifications: [],
    };

    console.log("Sending response:", response);
    res.json(response);
  } catch (error) {
    console.error("Error fetching mentor details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get mentee details by JWT token (for current user)
exports.getMyMenteeDetails = async (req, res) => {
  try {
    // The user ID comes from the JWT token via middleware
    const userId = req.user.userId;

    console.log("Fetching mentee details for current user:", userId);

    // Find the user
    const user = await User.findById(userId);

    console.log("User found:", user ? "Yes" : "No");
    if (user) {
      console.log("User isMentor:", user.isMentor);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get sessions for this mentee
    const sessions = await Session.find({ menteeId: userId })
      .populate("mentorId", "fullName professionalTitle profileImage")
      .sort({ date: -1 });

    // Calculate stats from real data
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(
      (s) => s.status === "completed"
    ).length;
    const upcomingSessions = sessions.filter(
      (s) => s.status === "scheduled" && new Date(s.date) > new Date()
    ).length;

    // Get unique mentors
    const mentorIds = [
      ...new Set(sessions.map((s) => s.mentorId._id.toString())),
    ];
    const totalMentors = mentorIds.length;

    // Calculate average rating from reviews
    const reviews = await Review.find({ menteeId: userId });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    // Calculate total spent
    const totalSpent = sessions
      .filter((s) => s.status === "completed")
      .reduce((sum, session) => sum + (session.totalAmount || 0), 0);

    // Format upcoming sessions
    const formattedUpcomingSessions = sessions
      .filter((s) => s.status === "scheduled" && new Date(s.date) > new Date())
      .slice(0, 5)
      .map((session) => ({
        id: session._id,
        title: session.title || "Career Guidance Session",
        mentorName: session.mentorId?.fullName || "Unknown Mentor",
        date: session.date.toLocaleDateString(),
        time: session.date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: session.status,
      }));

    // Format completed sessions
    const formattedCompletedSessions = sessions
      .filter((s) => s.status === "completed")
      .slice(0, 10)
      .map((session) => ({
        id: session._id,
        title: session.title || "Career Guidance Session",
        mentorName: session.mentorId?.fullName || "Unknown Mentor",
        date: session.date.toLocaleDateString(),
        time: session.date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        rating: 4.5, // Mock rating - would come from reviews
      }));

    // Format mentors worked with
    const mentorsWorkedWith = await Promise.all(
      mentorIds.map(async (mentorId) => {
        const mentorSessions = sessions.filter(
          (s) => s.mentorId._id.toString() === mentorId
        );
        const mentor = mentorSessions[0].mentorId;

        return {
          id: mentorId,
          name: mentor.fullName,
          title: mentor.professionalTitle,
          profileImage: await getS3Url(mentor.profileImage),
          sessionsCount: mentorSessions.length,
          rating: 4.5, // Mock rating
        };
      })
    );

    const stats = {
      totalSessions,
      completedSessions,
      upcomingSessions,
      totalMentors,
      averageRating: Math.round(averageRating * 10) / 10,
      totalSpent,
    };

    // Generate profile image URL if it exists (using cache)
    let profileImageUrl = null;
    if (user.profileImage) {
      console.log("=== getMyMenteeDetails Debug ===");
      console.log("User ID:", userId);
      console.log("User profileImage:", user.profileImage);
      profileImageUrl = await getCachedProfileImageUrl(user.profileImage);
      console.log(
        "Final profile image URL:",
        profileImageUrl ? "Generated/Cached" : "None"
      );
      console.log("=================================");
    }

    const responseData = {
      success: true,
      mentee: {
        _id: user._id,
        fullName: user.fullName || user.email.split("@")[0],
        email: user.email,
        profileImage: profileImageUrl,
        joinDate: user.createdAt,
        preferences: [
          "Career Development",
          "Interview Preparation",
          "Skill Building",
        ], // Mock preferences
      },
      stats,
      upcomingSessions: formattedUpcomingSessions,
      completedSessions: formattedCompletedSessions,
      mentorsWorkedWith,
      notifications: [], // Will be implemented later
    };

    console.log("Sending mentee response:", responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching mentee details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update mentor profile image
exports.updateProfileImage = async (req, res) => {
  try {
    console.log("=== updateProfileImage called ===");
    console.log("Request method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Request user:", req.user);
    console.log("Request file:", req.file);
    console.log("Request files:", req.files);
    console.log("Request headers:", req.headers);
    console.log("Request body keys:", Object.keys(req.body || {}));
    console.log("Content-Type:", req.get("Content-Type"));
    console.log("=================================");

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
      filename: req.file.filename || req.file.key, // Local filename or S3 key
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      location: req.file.location, // S3 URL
    });

    const mentor = user.mentorId;

    // Delete old profile image if it exists
    if (mentor.profileImage) {
      const oldFileKey = mentor.profileImage.replace(/^https:\/\/[^\/]+\//, "");
      await deleteFileFromS3(oldFileKey);
    }

    // Store the file key/filename in the database
    const fileKey = req.file.filename || req.file.key; // Use filename for local, key for S3
    mentor.profileImage = fileKey;
    await mentor.save();
    console.log("Mentor profile image updated successfully");

    // Get the full URL for the frontend
    console.log("File key:", fileKey);
    const fileUrl = await getS3Url(fileKey);
    console.log("File URL:", fileUrl);

    res.json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: fileUrl, // Return the full URL
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
