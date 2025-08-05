const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: false,
      maxlength: 1000,
    },
    reviewType: {
      type: String,
      enum: ["mentee-to-mentor", "mentor-to-mentee"],
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    reported: {
      type: Boolean,
      default: false,
    },
    reportReason: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
reviewSchema.index({ mentorId: 1, createdAt: -1 });
reviewSchema.index({ menteeId: 1, createdAt: -1 });
reviewSchema.index({ sessionId: 1 });
reviewSchema.index({ rating: 1 });

// Prevent duplicate reviews for the same session by the same user
reviewSchema.index({ sessionId: 1, menteeId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
