const mongoose = require("mongoose");

const linkedInSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    linkedInUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v); // Must be a valid URL
        },
        message: "LinkedIn URL must be a valid URL",
      },
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "completed"],
      default: "pending",
    },
    reviewNotes: {
      type: String,
      trim: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
    },
    reviewedAt: {
      type: Date,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // Additional form fields for LinkedIn review
    industry: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    targetRole: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      trim: true,
    },
    selectedReviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
linkedInSchema.index({ userId: 1, createdAt: -1 });
linkedInSchema.index({ status: 1 });
linkedInSchema.index({ isPublic: 1 });

// Method to get LinkedIn URL
linkedInSchema.methods.getLinkedInUrl = function () {
  return this.linkedInUrl;
};

// Method to check if LinkedIn review is accessible
linkedInSchema.methods.isAccessible = function () {
  return this.status !== "pending" || this.isPublic;
};

const LinkedIn = mongoose.model("LinkedIn", linkedInSchema);

module.exports = LinkedIn;
