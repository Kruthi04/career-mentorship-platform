const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: false, // Allow null for pending sessions
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    sessionType: {
      type: String,
      enum: [
        "resume_review",
        "interview_prep",
        "linkedin_review",
        "career_guidance",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "upcoming", "completed", "cancelled"],
      default: "pending",
    },
    scheduledDate: {
      type: Date,
    },
    scheduledTime: {
      type: String,
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },
    notes: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
    // For career services that become sessions
    careerServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
sessionSchema.index({ userId: 1, status: 1 });
sessionSchema.index({ mentorId: 1, status: 1 });

module.exports = mongoose.model("Session", sessionSchema);
