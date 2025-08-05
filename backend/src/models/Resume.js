const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
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
    // For file uploads - S3 key or local file path
    fileKey: {
      type: String,
      required: function () {
        return !this.resumeLink; // Required if no link provided
      },
    },
    // For resume links (Google Drive, Dropbox, etc.)
    resumeLink: {
      type: String,
      required: function () {
        return !this.fileKey; // Required if no file uploaded
      },
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow empty if fileKey is provided
          return /^https?:\/\/.+/.test(v); // Must be a valid URL
        },
        message: "Resume link must be a valid URL",
      },
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number, // in bytes
    },
    fileType: {
      type: String,
      enum: ["pdf", "doc", "docx"],
      required: true,
    },
    uploadMethod: {
      type: String,
      enum: ["file", "link"],
      required: true,
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
    // Additional form fields for resume review
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
resumeSchema.index({ userId: 1, createdAt: -1 });
resumeSchema.index({ status: 1 });
resumeSchema.index({ uploadMethod: 1 });
resumeSchema.index({ isPublic: 1 });

// Virtual for file URL (will be populated with presigned URL when needed)
resumeSchema.virtual("fileUrl").get(function () {
  if (this.resumeLink) {
    return this.resumeLink;
  }
  return null; // Will be populated by controller
});

// Ensure only one of fileKey or resumeLink is provided
resumeSchema.pre("save", function (next) {
  if (this.fileKey && this.resumeLink) {
    return next(new Error("Cannot have both file upload and resume link"));
  }
  if (!this.fileKey && !this.resumeLink) {
    return next(new Error("Must provide either file upload or resume link"));
  }
  next();
});

// Method to get resume URL (file or link)
resumeSchema.methods.getResumeUrl = function () {
  if (this.resumeLink) {
    return this.resumeLink;
  }
  return null; // Will be populated by controller with presigned URL
};

// Method to check if resume is accessible
resumeSchema.methods.isAccessible = function () {
  return this.status !== "pending" || this.isPublic;
};

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
