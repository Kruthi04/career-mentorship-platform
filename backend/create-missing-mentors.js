const mongoose = require("mongoose");
const Mentor = require("./src/models/Mentor");
const User = require("./src/models/User");
require("dotenv").config();

// Connect to MongoDB (cloud database)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Cloud MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function createMissingMentors() {
  try {
    console.log("Finding users with isMentor: true...");

    // Find all users who are marked as mentors
    const mentorUsers = await User.find({ isMentor: true });
    console.log(`Found ${mentorUsers.length} users marked as mentors`);

    for (const user of mentorUsers) {
      console.log(`\nProcessing user: ${user.name} (${user.email})`);

      // Check if mentor document already exists
      const existingMentor = await Mentor.findById(user.mentorId);

      if (existingMentor) {
        console.log(`✅ Mentor document already exists for ${user.name}`);
        continue;
      }

      console.log(
        `❌ No mentor document found for ${user.name}, creating one...`
      );

      // Create a new mentor document
      const mentorData = {
        fullName: user.name,
        professionalTitle: "Professional Mentor", // Default title
        location: "Remote",
        bio: `${user.name} is a professional mentor with expertise in career development and guidance.`,
        areasOfExpertise: ["Career Development", "Professional Growth"],
        skills: ["Mentoring", "Career Guidance", "Professional Development"],
        yearsOfExperience: 5,
        languagesSpoken: ["English"],
        linkedInUrl: "https://linkedin.com/in/mentor",
        personalWebsite: "",
        hourlyRate: 100,
        offerFreeIntro: true,
        helpAreas: ["Career Guidance", "Interview Prep", "Skill Development"],
        sessionDuration: 60,
        availability: "Weekdays 6-9 PM, Weekends 10 AM-2 PM",
        verified: true,
        profileImage: null,
        idVerification: "pending-verification.pdf",
        userId: user._id,
      };

      const newMentor = new Mentor(mentorData);
      const savedMentor = await newMentor.save();

      console.log(
        `✅ Created mentor document for ${user.name} with ID: ${savedMentor._id}`
      );

      // Update user's mentorId to point to the new mentor document
      user.mentorId = savedMentor._id;
      await user.save();

      console.log(
        `✅ Updated user ${user.name} with new mentorId: ${savedMentor._id}`
      );
    }

    console.log("\n🎉 Finished creating missing mentor documents!");

    // List all mentors
    const allMentors = await Mentor.find({});
    console.log(`\nTotal mentors in database: ${allMentors.length}`);
    allMentors.forEach((mentor) => {
      console.log(
        `- ${mentor.fullName} (${mentor.professionalTitle}) - Verified: ${mentor.verified}`
      );
    });
  } catch (error) {
    console.error("Error creating missing mentors:", error);
  } finally {
    mongoose.connection.close();
  }
}

createMissingMentors();
