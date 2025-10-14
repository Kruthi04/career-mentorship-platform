const mongoose = require("mongoose");
const searchService = require("../src/services/searchService");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function testSearch() {
  try {
    console.log("🧪 Testing Search Functionality...\n");

    // Test 1: Search Analytics
    console.log("1. Testing Search Analytics...");
    const analytics = await searchService.getSearchAnalytics();
    console.log("✅ Analytics loaded successfully");
    console.log(`   - Total mentors: ${analytics.totalMentors}`);
    console.log(`   - Expertise areas: ${analytics.expertiseAreas.length}`);
    console.log(`   - Skills: ${analytics.skills.length}`);
    console.log(`   - Help areas: ${analytics.helpAreas.length}\n`);

    // Test 2: Basic Mentor Search
    console.log("2. Testing Basic Mentor Search...");
    const basicSearch = await searchService.searchMentors({
      query: "",
      page: 1,
      limit: 5,
    });
    console.log("✅ Basic search completed");
    console.log(`   - Found ${basicSearch.mentors.length} mentors`);
    console.log(`   - Total available: ${basicSearch.pagination.total}\n`);

    // Test 3: Text Search
    console.log("3. Testing Text Search...");
    const textSearch = await searchService.searchMentors({
      query: "software",
      page: 1,
      limit: 5,
    });
    console.log("✅ Text search completed");
    console.log(
      `   - Found ${textSearch.mentors.length} mentors for "software"`
    );
    console.log(`   - Total matches: ${textSearch.pagination.total}\n`);

    // Test 4: Search Suggestions
    console.log("4. Testing Search Suggestions...");
    const suggestions = await searchService.getSearchSuggestions(
      "java",
      "skills"
    );
    console.log("✅ Suggestions loaded");
    console.log(
      `   - Found ${suggestions.length} skill suggestions for "java"`
    );
    if (suggestions.length > 0) {
      console.log(
        `   - First suggestion: ${suggestions[0]._id} (${suggestions[0].count} mentors)`
      );
    }
    console.log("");

    // Test 5: Filtered Search
    console.log("5. Testing Filtered Search...");
    const filteredSearch = await searchService.searchMentors({
      query: "",
      minExperience: 5,
      maxHourlyRate: 100,
      page: 1,
      limit: 5,
    });
    console.log("✅ Filtered search completed");
    console.log(
      `   - Found ${filteredSearch.mentors.length} mentors with filters`
    );
    console.log(`   - Total matches: ${filteredSearch.pagination.total}\n`);

    // Test 6: Pagination
    console.log("6. Testing Pagination...");
    const paginationTest = await searchService.searchMentors({
      query: "",
      page: 2,
      limit: 3,
    });
    console.log("✅ Pagination test completed");
    console.log(
      `   - Page ${paginationTest.pagination.page} of ${paginationTest.pagination.totalPages}`
    );
    console.log(`   - Results per page: ${paginationTest.pagination.limit}`);
    console.log(`   - Has next: ${paginationTest.pagination.hasNext}`);
    console.log(`   - Has prev: ${paginationTest.pagination.hasPrev}\n`);

    // Test 7: Global Search
    console.log("7. Testing Global Search...");
    const globalSearch = await searchService.globalSearch("test", 1, 10);
    console.log("✅ Global search completed");
    console.log(`   - Mentors: ${globalSearch.mentors.length}`);
    console.log(`   - Users: ${globalSearch.users.length}`);
    console.log(`   - Sessions: ${globalSearch.sessions.length}\n`);

    console.log("🎉 All search tests completed successfully!");
    console.log("\n📊 Search System Status: ✅ OPERATIONAL");
  } catch (error) {
    console.error("❌ Search test failed:", error.message);
    console.error("Stack trace:", error.stack);

    // Provide helpful debugging information
    console.log("\n🔍 Debugging Tips:");
    console.log("1. Check if MongoDB Atlas Search indexes are created");
    console.log("2. Verify your MongoDB connection string");
    console.log("3. Ensure you have data in your collections");
    console.log("4. Check the MONGODB_ATLAS_SEARCH_SETUP.md guide");
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Run the test
testSearch();

