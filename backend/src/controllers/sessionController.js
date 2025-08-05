const Session = require("../models/Session");
const Resume = require("../models/Resume");
const Mentor = require("../models/Mentor");

// Get all sessions for a user
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const sessions = await Session.find({ userId })
      .populate("mentorId", "fullName email profileImage")
      .populate("careerServiceId", "title description")
      .sort({ createdAt: -1 });

    // Group sessions by status
    const pendingSessions = sessions.filter(
      (session) => session.status === "pending"
    );
    const upcomingSessions = sessions.filter(
      (session) => session.status === "upcoming"
    );
    const completedSessions = sessions.filter(
      (session) => session.status === "completed"
    );

    res.status(200).json({
      success: true,
      message: "Sessions retrieved successfully",
      sessions: {
        pending: pendingSessions,
        upcoming: upcomingSessions,
        completed: completedSessions,
        all: sessions,
      },
    });
  } catch (error) {
    console.error("Error getting user sessions:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving sessions",
      error: error.message,
    });
  }
};

// Create a new session (from career service)
exports.createSessionFromCareerService = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { careerServiceId, sessionType } = req.body;

    // Verify the career service exists and belongs to the user
    const careerService = await Resume.findById(careerServiceId);
    if (!careerService || careerService.userId.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: "Career service not found",
      });
    }

    // Create a pending session without a specific mentor
    // The mentor will be assigned when they review the career service
    const session = new Session({
      userId,
      mentorId: null, // Will be assigned when mentor picks up the service
      careerServiceId,
      title: careerService.title,
      description: careerService.description,
      sessionType: sessionType || "resume_review",
      status: "pending", // Start as pending
      scheduledDate: null, // Will be set when mentor schedules
      scheduledTime: null,
      duration: 60,
    });

    await session.save();

    // Update career service status to indicate it's been converted to a session
    await Resume.findByIdAndUpdate(careerServiceId, {
      status: "session_created",
    });

    res.status(201).json({
      success: true,
      message: "Session created successfully from career service",
      session,
    });
  } catch (error) {
    console.error("Error creating session from career service:", error);
    res.status(500).json({
      success: false,
      message: "Error creating session from career service",
      error: error.message,
    });
  }
};

// Update session status (mentor actions)
exports.updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, scheduledDate, scheduledTime, notes } = req.body;
    const mentorId = req.user.userId; // Assuming mentor is logged in

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Verify the mentor owns this session
    if (session.mentorId.toString() !== mentorId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this session",
      });
    }

    // Update session
    const updateData = { status };
    if (scheduledDate) updateData.scheduledDate = scheduledDate;
    if (scheduledTime) updateData.scheduledTime = scheduledTime;
    if (notes) updateData.notes = notes;

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      updateData,
      { new: true }
    ).populate("mentorId", "fullName email profileImage");

    res.status(200).json({
      success: true,
      message: "Session status updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Error updating session status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating session status",
      error: error.message,
    });
  }
};

// Complete a session (mentor actions)
exports.completeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { rating, review } = req.body;
    const mentorId = req.user.userId;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Verify the mentor owns this session
    if (session.mentorId.toString() !== mentorId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to complete this session",
      });
    }

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      {
        status: "completed",
        rating,
        review,
      },
      { new: true }
    ).populate("mentorId", "fullName email profileImage");

    res.status(200).json({
      success: true,
      message: "Session completed successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Error completing session:", error);
    res.status(500).json({
      success: false,
      message: "Error completing session",
      error: error.message,
    });
  }
};

// Get sessions for a mentor
exports.getMentorSessions = async (req, res) => {
  try {
    const mentorId = req.user.userId;

    const sessions = await Session.find({ mentorId })
      .populate("userId", "fullName email")
      .populate("careerServiceId", "title description")
      .sort({ createdAt: -1 });

    // Group sessions by status
    const pendingSessions = sessions.filter(
      (session) => session.status === "pending"
    );
    const upcomingSessions = sessions.filter(
      (session) => session.status === "upcoming"
    );
    const completedSessions = sessions.filter(
      (session) => session.status === "completed"
    );

    res.status(200).json({
      success: true,
      message: "Mentor sessions retrieved successfully",
      sessions: {
        pending: pendingSessions,
        upcoming: upcomingSessions,
        completed: completedSessions,
        all: sessions,
      },
    });
  } catch (error) {
    console.error("Error getting mentor sessions:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving mentor sessions",
      error: error.message,
    });
  }
};

// Mentor picks up a pending session
exports.pickupPendingSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const mentorId = req.user.userId;
    const { scheduledDate, scheduledTime, notes } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found"
      });
    }

    if (session.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Session is not in pending status"
      });
    }

    // Update session with mentor and schedule
    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      {
        mentorId,
        status: "upcoming",
        scheduledDate,
        scheduledTime,
        notes
      },
      { new: true }
    ).populate("mentorId", "fullName email profileImage");

    res.status(200).json({
      success: true,
      message: "Session picked up successfully",
      session: updatedSession
    });
  } catch (error) {
    console.error("Error picking up session:", error);
    res.status(500).json({
      success: false,
      message: "Error picking up session",
      error: error.message,
    });
  }
};

// Get pending sessions for mentors to pick up
exports.getPendingSessions = async (req, res) => {
  try {
    const pendingSessions = await Session.find({ 
      status: "pending",
      mentorId: null 
    })
    .populate("userId", "fullName email")
    .populate("careerServiceId", "title description industry experience targetRole priority")
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Pending sessions retrieved successfully",
      sessions: pendingSessions
    });
  } catch (error) {
    console.error("Error getting pending sessions:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving pending sessions",
      error: error.message,
    });
  }
};
