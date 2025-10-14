const mongoose = require("mongoose");
require("dotenv").config();

// Import User model
const User = require("../src/models/User");

async function migrateToOAuth() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all users with Phyllo data
    const usersWithPhyllo = await User.find({
      "linkedInProfile.phylloAccountId": { $exists: true, $ne: null },
    });

    console.log(`Found ${usersWithPhyllo.length} users with Phyllo data`);

    for (const user of usersWithPhyllo) {
      console.log(`Migrating user: ${user.email}`);

      // Reset LinkedIn profile to OAuth format
      const updatedLinkedInProfile = {
        linkedInId: null,
        headline: user.linkedInProfile.headline || null,
        company: user.linkedInProfile.company || null,
        position: user.linkedInProfile.position || null,
        profileUrl: user.linkedInProfile.profileUrl || null,
        linkedInUrl: user.linkedInProfile.linkedInUrl || null,
        accessToken: null,
        refreshToken: null,
        tokenExpiry: null,
        verificationStatus: "not_initiated",
        verified: false,
        verificationDate: null,
        lastUpdated: new Date(),
        profileData: null,
      };

      // Update user
      await User.findByIdAndUpdate(user._id, {
        linkedInProfile: updatedLinkedInProfile,
      });

      console.log(`✓ Migrated user: ${user.email}`);
    }

    console.log("\nMigration completed successfully!");
    console.log(`Total users migrated: ${usersWithPhyllo.length}`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToOAuth();
}

module.exports = migrateToOAuth;
