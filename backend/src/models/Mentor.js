const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    profileImage: { type: String }, // URL or file path
    professionalTitle: { type: String, required: true },
    location: { type: String, required: true },
    bio: { type: String, required: true },
    areasOfExpertise: [{ type: String, required: true }],
    skills: [{ type: String }],
    yearsOfExperience: { type: Number, required: true },
    languagesSpoken: [{ type: String }],
    linkedInUrl: { type: String, required: true },
    personalWebsite: { type: String },
    idVerification: { type: String, required: true }, // Required for security
    hourlyRate: { type: Number, required: true },
    offerFreeIntro: { type: Boolean, default: false },
    helpAreas: [{ type: String }], // e.g., Resume Review, Interview Preparation, etc.
    sessionDuration: { type: String, required: true },
    availability: [{ type: String }], // Changed to array of strings
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentor", mentorSchema);
