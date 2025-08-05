const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/careerhub",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const createMentee = async () => {
  try {
    console.log("👤 Creating mentee user...");

    // Check if mentee already exists
    const existingMentee = await User.findOne({ email: "mentee@example.com" });
    if (existingMentee) {
      console.log("✅ Mentee already exists:", existingMentee.email);
      return existingMentee;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 12);

    // Create mentee user
    const mentee = new User({
      fullName: "John Doe",
      email: "mentee@example.com",
      password: hashedPassword,
      isMentor: false,
    });

    await mentee.save();
    console.log("✅ Created mentee:", mentee.email);
    return mentee;
  } catch (error) {
    console.error("❌ Error creating mentee:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
createMentee();
