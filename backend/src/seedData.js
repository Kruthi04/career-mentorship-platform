const mongoose = require("mongoose");
const Session = require("./models/Session");
const Review = require("./models/Review");
const Mentor = require("./models/Mentor");
const User = require("./models/User");

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/careerhub",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const seedData = async () => {
  try {
    console.log("🌱 Starting data seeding...");

    // Find existing users and mentors
    const users = await User.find();
    const mentors = await Mentor.find();

    if (users.length === 0 || mentors.length === 0) {
      console.log(
        "❌ No users or mentors found. Please create some users and mentors first."
      );
      return;
    }

    // Get a mentee (user who is not a mentor)
    const mentee = users.find((user) => !user.isMentor);
    if (!mentee) {
      console.log(
        "❌ No mentee found. Please create a user who is not a mentor."
      );
      return;
    }

    console.log(`👤 Using mentee: ${mentee.fullName || mentee.email}`);

    // Clear existing sessions for this mentee
    await Session.deleteMany({ menteeId: mentee._id });
    await Review.deleteMany({ menteeId: mentee._id });

    // Create sample sessions
    const sampleSessions = [
      {
        mentorId: mentors[0]._id,
        menteeId: mentee._id,
        title: "Career Guidance Session",
        description: "Discussing career goals and development strategies",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: 60,
        status: "scheduled",
        sessionType: "career-guidance",
        platform: "zoom",
        meetingLink: "https://zoom.us/j/123456789",
        hourlyRate: 100,
        totalAmount: 100,
        paymentStatus: "pending",
      },
      {
        mentorId: mentors[0]._id,
        menteeId: mentee._id,
        title: "Interview Preparation",
        description: "Mock interview and feedback session",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        duration: 90,
        status: "completed",
        sessionType: "interview-prep",
        platform: "google-meet",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        hourlyRate: 120,
        totalAmount: 180,
        paymentStatus: "completed",
      },
      {
        mentorId: mentors[0]._id,
        menteeId: mentee._id,
        title: "Resume Review",
        description:
          "Comprehensive resume analysis and improvement suggestions",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        duration: 45,
        status: "completed",
        sessionType: "resume-review",
        platform: "zoom",
        meetingLink: "https://zoom.us/j/987654321",
        hourlyRate: 100,
        totalAmount: 75,
        paymentStatus: "completed",
      },
      {
        mentorId: mentors[0]._id,
        menteeId: mentee._id,
        title: "Skill Development Workshop",
        description: "Learning new technical skills and best practices",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        duration: 120,
        status: "scheduled",
        sessionType: "skill-development",
        platform: "teams",
        meetingLink: "https://teams.microsoft.com/l/meetup-join/...",
        hourlyRate: 150,
        totalAmount: 300,
        paymentStatus: "pending",
      },
    ];

    // Insert sessions
    const createdSessions = await Session.insertMany(sampleSessions);
    console.log(`✅ Created ${createdSessions.length} sessions`);

    // Create sample reviews for completed sessions
    const completedSessions = createdSessions.filter(
      (s) => s.status === "completed"
    );
    const sampleReviews = completedSessions.map((session) => ({
      sessionId: session._id,
      mentorId: session.mentorId,
      menteeId: session.menteeId,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      comment: "Great session! Very helpful and informative.",
      reviewType: "mentee-to-mentor",
      isAnonymous: false,
    }));

    const createdReviews = await Review.insertMany(sampleReviews);
    console.log(`✅ Created ${createdReviews.length} reviews`);

    console.log("🎉 Data seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Sessions: ${createdSessions.length}`);
    console.log(`   - Reviews: ${createdReviews.length}`);
    console.log(`   - Mentee: ${mentee.fullName || mentee.email}`);
    console.log(`   - Mentor: ${mentors[0].fullName}`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
seedData();
