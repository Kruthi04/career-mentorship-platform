const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["mentee", "mentor", "both"],
      default: "mentee",
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      default: null,
    },
    isMentor: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: null,
    },
    // LinkedIn verification fields (updated for Phyllo)
    linkedInProfile: {
      linkedInId: String,
      headline: String,
      company: String,
      position: String,
      profileUrl: String,
      linkedInUrl: String, // LinkedIn URL for verification
      phylloAccountId: String, // Phyllo account ID
      verificationStatus: {
        type: String,
        enum: [
          "not_initiated",
          "pending",
          "connected",
          "verified",
          "failed",
          "disconnected",
        ],
        default: "not_initiated",
      },
      verified: {
        type: Boolean,
        default: false,
      },
      verificationDate: Date,
      lastUpdated: Date,
      // Additional Phyllo fields
      profileData: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
