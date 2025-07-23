const mongoose = require("mongoose");
const Session = require("../models/Session");
const Review = require("../models/Review");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const addTestData = async () => {
  try {
    // Get the first mentor from the database
    const mentor = await Mentor.findOne();
    if (!mentor) {
      console.log("No mentors found in database");
      return;
    }

    // Get or create a test user
    let testUser = await User.findOne({ email: "test@example.com" });
    if (!testUser) {
      testUser = new User({
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
      });
      await testUser.save();
    }

    // Add test sessions
    const testSessions = [
      {
        mentorId: mentor._id,
        menteeId: testUser._id,
        title: "Career Guidance Session",
        description: "General career advice and planning",
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        duration: 60,
        status: "scheduled",
        platform: "Zoom",
        hourlyRate: mentor.hourlyRate,
        totalAmount: mentor.hourlyRate,
      },
      {
        mentorId: mentor._id,
        menteeId: testUser._id,
        title: "Resume Review",
        description: "Comprehensive resume review and optimization",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        duration: 45,
        status: "scheduled",
        platform: "Google Meet",
        hourlyRate: mentor.hourlyRate,
        totalAmount: mentor.hourlyRate * 0.75,
      },
      {
        mentorId: mentor._id,
        menteeId: testUser._id,
        title: "Technical Interview Prep",
        description: "Mock technical interview and feedback",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday (completed)
        duration: 90,
        status: "completed",
        platform: "Zoom",
        hourlyRate: mentor.hourlyRate,
        totalAmount: mentor.hourlyRate * 1.5,
      },
    ];

    for (const sessionData of testSessions) {
      const existingSession = await Session.findOne({
        mentorId: sessionData.mentorId,
        menteeId: sessionData.menteeId,
        title: sessionData.title,
        date: sessionData.date,
      });

      if (!existingSession) {
        const session = new Session(sessionData);
        await session.save();
        console.log(`Created session: ${session.title}`);
      }
    }

    // Add test reviews
    const testReviews = [
      {
        sessionId: (
          await Session.findOne({ title: "Technical Interview Prep" })
        )._id,
        mentorId: mentor._id,
        menteeId: testUser._id,
        rating: 5,
        comment:
          "Excellent session! The mock interview was very helpful and the feedback was detailed and actionable.",
        isPublic: true,
      },
      {
        sessionId: (await Session.findOne({ title: "Career Guidance Session" }))
          ._id,
        mentorId: mentor._id,
        menteeId: testUser._id,
        rating: 4,
        comment:
          "Great career advice. Helped me clarify my career goals and next steps.",
        isPublic: true,
      },
    ];

    for (const reviewData of testReviews) {
      const existingReview = await Review.findOne({
        sessionId: reviewData.sessionId,
        mentorId: reviewData.mentorId,
        menteeId: reviewData.menteeId,
      });

      if (!existingReview) {
        const review = new Review(reviewData);
        await review.save();
        console.log(`Created review with rating: ${review.rating}`);
      }
    }

    console.log("Test data added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding test data:", error);
    process.exit(1);
  }
};

addTestData();
