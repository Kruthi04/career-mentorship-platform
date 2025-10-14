const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const Mentor = require("../src/models/Mentor");

async function testAtlasSearch() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    console.log("\n🧪 Testing Atlas Search functionality...");

    // Test 1: Check if mentor-search-index exists
    console.log("\n1️⃣ Testing mentor search index...");
    try {
      const testResult = await Mentor.aggregate([
        {
          $search: {
            index: "mentor-search-index",
            text: {
              query: "software",
              path: "fullName",
            },
          },
        },
        { $limit: 1 },
      ]);
      console.log("✅ Atlas Search index 'mentor-search-index' is working!");
      console.log(`   Found ${testResult.length} result(s) for 'software'`);
    } catch (error) {
      console.log("❌ Atlas Search index 'mentor-search-index' not found or not ready");
      console.log(`   Error: ${error.message}`);
    }

    // Test 2: Test full search functionality
    console.log("\n2️⃣ Testing full search functionality...");
    try {
      const searchResult = await Mentor.aggregate([
        {
          $search: {
            index: "mentor-search-index",
            compound: {
              should: [
                {
                  text: {
                    query: "software",
                    path: ["fullName", "professionalTitle", "bio"],
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 3,
                    },
                  },
                },
              ],
            },
          },
        },
        { $match: { verified: true } },
        {
          $addFields: {
            searchScore: { $meta: "searchScore" },
          },
        },
        {
          $sort: {
            searchScore: { $meta: "searchScore" },
            createdAt: -1,
          },
        },
        { $limit: 5 },
      ]);
      console.log("✅ Full search functionality is working!");
      console.log(`   Found ${searchResult.length} mentor(s) matching 'software'`);
      if (searchResult.length > 0) {
        console.log("   Sample results:");
        searchResult.forEach((mentor, index) => {
          console.log(`   ${index + 1}. ${mentor.fullName} - ${mentor.professionalTitle}`);
        });
      }
    } catch (error) {
      console.log("❌ Full search functionality failed");
      console.log(`   Error: ${error.message}`);
    }

    // Test 3: Test autocomplete
    console.log("\n3️⃣ Testing autocomplete functionality...");
    try {
      const autocompleteResult = await Mentor.aggregate([
        {
          $search: {
            index: "mentor-search-index",
            autocomplete: {
              query: "sof",
              path: "fullName",
              fuzzy: {
                maxEdits: 1,
                prefixLength: 2,
              },
            },
          },
        },
        {
          $project: {
            fullName: 1,
            professionalTitle: 1,
          },
        },
        { $limit: 3 },
      ]);
      console.log("✅ Autocomplete functionality is working!");
      console.log(`   Found ${autocompleteResult.length} suggestion(s) for 'sof'`);
      if (autocompleteResult.length > 0) {
        console.log("   Suggestions:");
        autocompleteResult.forEach((mentor, index) => {
          console.log(`   ${index + 1}. ${mentor.fullName}`);
        });
      }
    } catch (error) {
      console.log("❌ Autocomplete functionality failed");
      console.log(`   Error: ${error.message}`);
    }

    // Test 4: Test regular search (fallback)
    console.log("\n4️⃣ Testing regular search (fallback)...");
    try {
      const regularResult = await Mentor.find({
        verified: true,
        $or: [
          { fullName: { $regex: "software", $options: "i" } },
          { professionalTitle: { $regex: "software", $options: "i" } },
          { bio: { $regex: "software", $options: "i" } },
        ],
      }).limit(5);
      console.log("✅ Regular search (fallback) is working!");
      console.log(`   Found ${regularResult.length} mentor(s) matching 'software'`);
    } catch (error) {
      console.log("❌ Regular search (fallback) failed");
      console.log(`   Error: ${error.message}`);
    }

    console.log("\n🎉 Atlas Search testing completed!");
    console.log("\n📋 Next steps:");
    console.log("   1. If Atlas Search is working: Your search is ready to use!");
    console.log("   2. If Atlas Search failed: Check the setup guide in ATLAS_SEARCH_SETUP.md");
    console.log("   3. The fallback search will work regardless of Atlas Search status");

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the test
testAtlasSearch();

