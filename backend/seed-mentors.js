const mongoose = require("mongoose");
const Mentor = require("./src/models/Mentor");
const User = require("./src/models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Connect to MongoDB (cloud database)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Cloud MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const testMentors = [
  {
    fullName: "Sarah Johnson",
    professionalTitle: "Senior Software Engineer",
    location: "San Francisco, CA",
    bio: "10+ years of experience in full-stack development with expertise in React, Node.js, and cloud technologies. Passionate about mentoring junior developers and helping them grow their careers.",
    areasOfExpertise: [
      "Software Development",
      "Career Growth",
      "Technical Interviews",
    ],
    skills: ["React", "Node.js", "JavaScript", "Python", "AWS", "Docker"],
    yearsOfExperience: 10,
    languagesSpoken: ["English"],
    linkedInUrl: "https://linkedin.com/in/sarahjohnson",
    personalWebsite: "https://sarahjohnson.dev",
    hourlyRate: 150,
    offerFreeIntro: true,
    helpAreas: ["Resume Review", "Interview Prep", "Career Guidance"],
    sessionDuration: 60,
    availability: "Weekdays 6-9 PM, Weekends 10 AM-2 PM",
    verified: true,
    profileImage: null,
    idVerification: "test-verification.pdf",
  },
  {
    fullName: "Michael Chen",
    professionalTitle: "Data Scientist",
    location: "New York, NY",
    bio: "Expert in machine learning and data science with 8 years of experience. Specialized in Python, TensorFlow, and building scalable ML solutions. Love helping others break into data science.",
    areasOfExpertise: ["Data Science", "Machine Learning", "Career Transition"],
    skills: [
      "Python",
      "TensorFlow",
      "Pandas",
      "SQL",
      "Scikit-learn",
      "Deep Learning",
    ],
    yearsOfExperience: 8,
    languagesSpoken: ["English", "Mandarin"],
    linkedInUrl: "https://linkedin.com/in/michaelchen",
    personalWebsite: "https://michaelchen.ai",
    hourlyRate: 120,
    offerFreeIntro: true,
    helpAreas: ["Project Guidance", "Portfolio Review", "Interview Prep"],
    sessionDuration: 45,
    availability: "Weekdays 7-9 PM, Weekends 2-6 PM",
    verified: true,
    profileImage: null,
    idVerification: "test-verification.pdf",
  },
  {
    fullName: "Emily Rodriguez",
    professionalTitle: "Product Manager",
    location: "Austin, TX",
    bio: "Product leader with 7 years of experience building user-centric products. Expert in agile methodologies, user research, and product strategy. Dedicated to helping PMs advance their careers.",
    areasOfExpertise: ["Product Management", "Leadership", "Strategy"],
    skills: [
      "Product Strategy",
      "User Research",
      "Agile",
      "SQL",
      "Analytics",
      "A/B Testing",
    ],
    yearsOfExperience: 7,
    languagesSpoken: ["English", "Spanish"],
    linkedInUrl: "https://linkedin.com/in/emilyrodriguez",
    personalWebsite: "https://emilyrodriguez.com",
    hourlyRate: 130,
    offerFreeIntro: true,
    helpAreas: ["Career Planning", "Interview Prep", "Skill Development"],
    sessionDuration: 60,
    availability: "Weekdays 6-8 PM, Weekends 10 AM-4 PM",
    verified: true,
    profileImage: null,
    idVerification: "test-verification.pdf",
  },
  {
    fullName: "David Wilson",
    professionalTitle: "UX/UI Designer",
    location: "Seattle, WA",
    bio: "Creative designer with 6 years of experience crafting beautiful and functional user experiences. Expert in Figma, user research, and design systems. Passionate about mentoring designers.",
    areasOfExpertise: ["UX/UI Design", "User Research", "Design Systems"],
    skills: [
      "Figma",
      "Sketch",
      "Adobe Creative Suite",
      "User Research",
      "Prototyping",
      "Design Systems",
    ],
    yearsOfExperience: 6,
    languagesSpoken: ["English"],
    linkedInUrl: "https://linkedin.com/in/davidwilson",
    personalWebsite: "https://davidwilson.design",
    hourlyRate: 110,
    offerFreeIntro: true,
    helpAreas: ["Portfolio Review", "Design Critique", "Career Guidance"],
    sessionDuration: 45,
    availability: "Weekdays 7-9 PM, Weekends 1-5 PM",
    verified: true,
    profileImage: null,
    idVerification: "test-verification.pdf",
  },
  {
    fullName: "Lisa Thompson",
    professionalTitle: "Marketing Director",
    location: "Chicago, IL",
    bio: "Strategic marketing leader with 9 years of experience in digital marketing, brand strategy, and growth marketing. Expert in helping marketing professionals advance their careers.",
    areasOfExpertise: [
      "Digital Marketing",
      "Brand Strategy",
      "Growth Marketing",
    ],
    skills: [
      "Google Ads",
      "Facebook Ads",
      "SEO",
      "Content Marketing",
      "Analytics",
      "Brand Strategy",
    ],
    yearsOfExperience: 9,
    languagesSpoken: ["English"],
    linkedInUrl: "https://linkedin.com/in/lisathompson",
    personalWebsite: "https://lisathompson.com",
    hourlyRate: 140,
    offerFreeIntro: true,
    helpAreas: ["Career Strategy", "Interview Prep", "Skill Development"],
    sessionDuration: 60,
    availability: "Weekdays 6-8 PM, Weekends 11 AM-3 PM",
    verified: true,
    profileImage: null,
    idVerification: "test-verification.pdf",
  },
];

async function seedMentors() {
  try {
    console.log("Starting to seed mentors...");

    // Clear existing mentors and users
    await Mentor.deleteMany({});
    await User.deleteMany({ email: { $regex: /@example\.com$/ } });
    console.log("Cleared existing mentors and test users");

    // Create users and mentors
    for (const mentorData of testMentors) {
      // Create user
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = new User({
        name: mentorData.fullName,
        email: `${mentorData.fullName
          .toLowerCase()
          .replace(" ", ".")}@example.com`,
        password: hashedPassword,
        isMentor: true,
      });

      const savedUser = await user.save();
      console.log(`Created user: ${savedUser.name}`);

      // Create mentor
      const mentor = new Mentor({
        ...mentorData,
        userId: savedUser._id,
      });

      const savedMentor = await mentor.save();
      console.log(`Created mentor: ${savedMentor.fullName}`);

      // Update user with mentor ID
      savedUser.mentorId = savedMentor._id;
      await savedUser.save();
    }

    console.log("✅ Successfully seeded mentors!");
    console.log(`Created ${testMentors.length} verified mentors`);

    // List all mentors
    const allMentors = await Mentor.find({});
    console.log("\nAll mentors in database:");
    allMentors.forEach((mentor) => {
      console.log(
        `- ${mentor.fullName} (${mentor.professionalTitle}) - Verified: ${mentor.verified}`
      );
    });
  } catch (error) {
    console.error("Error seeding mentors:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedMentors();
