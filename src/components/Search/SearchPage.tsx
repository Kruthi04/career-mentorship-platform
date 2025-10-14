import React, { useState, useEffect } from "react";
import { User, Search, Zap, Info } from "lucide-react";

interface Mentor {
  _id: string;
  fullName: string;
  professionalTitle: string;
  profileImage: string;
  location: string;
  bio: string;
  areasOfExpertise: string[];
  skills: string[];
  yearsOfExperience: number;
  hourlyRate: number;
  offerFreeIntro: boolean;
  helpAreas: string[];
  verified: boolean;
}

interface SearchResponse {
  mentors: Mentor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  atlasSearchEnabled?: boolean;
}

export const SearchPage: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [atlasSearchEnabled, setAtlasSearchEnabled] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  console.log("SearchPage component rendering", { mentors, isLoading, error, atlasSearchEnabled });

  useEffect(() => {
    console.log("SearchPage useEffect running");
    loadMentors();
  }, []);

  const loadMentors = async (query: string = "") => {
    console.log("loadMentors function called with query:", query);
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (query.trim()) {
        // Try Atlas Search first
        console.log("Trying Atlas Search...");
        response = await fetch(`/api/search/mentors?q=${encodeURIComponent(query)}`);
        console.log("Atlas Search API response status:", response.status);
        
        if (response.ok) {
          const data: SearchResponse = await response.json();
          console.log("Atlas Search data received:", data.mentors.length, "mentors");
          setMentors(data.mentors);
          setAtlasSearchEnabled(data.atlasSearchEnabled || false);
          return;
        }
      }
      
      // Fallback to regular API
      console.log("Using fallback API...");
      response = await fetch("/api/mentors/verified");
      console.log("Fallback API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Fallback data received:", data.length, "mentors");
        
        // Filter mentors if we have a search query
        let filteredMentors = data;
        if (query.trim()) {
          const searchTerm = query.toLowerCase();
          filteredMentors = data.filter((mentor: Mentor) =>
            mentor.fullName.toLowerCase().includes(searchTerm) ||
            mentor.professionalTitle.toLowerCase().includes(searchTerm) ||
            mentor.bio.toLowerCase().includes(searchTerm) ||
            mentor.areasOfExpertise.some(area => area.toLowerCase().includes(searchTerm)) ||
            mentor.skills.some(skill => skill.toLowerCase().includes(searchTerm))
          );
        }
        
        setMentors(filteredMentors);
        setAtlasSearchEnabled(false);
      } else {
        console.error(
          "API response not ok:",
          response.status,
          response.statusText
        );
        throw new Error("Failed to load mentors");
      }
    } catch (err) {
      console.error("Error loading mentors:", err);
      setError("Failed to load mentors. Please try again.");
    } finally {
      console.log("Setting loading to false");
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    loadMentors(query);
  };

  console.log("Rendering SearchPage with state:", {
    mentors: mentors.length,
    isLoading,
    error,
    atlasSearchEnabled,
    searchQuery,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={loadMentors}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Find Your Perfect Mentor
            </h1>
            {atlasSearchEnabled !== null && (
              <div className="flex items-center space-x-2">
                {atlasSearchEnabled ? (
                  <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                    <Zap className="w-4 h-4 mr-1" />
                    Atlas Search Active
                  </div>
                ) : (
                  <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                    <Search className="w-4 h-4 mr-1" />
                    Basic Search
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-gray-600">
            Search through {mentors.length} verified mentors to find the right
            match for your career goals.
          </p>
          {atlasSearchEnabled === false && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800">
                    Enhanced Search Available
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Set up MongoDB Atlas Search for faster, more accurate results with autocomplete and typo tolerance.
                    <a 
                      href="/ATLAS_SEARCH_SETUP.md" 
                      className="ml-1 underline hover:text-blue-900"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View setup guide
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search mentors by name, skills, or expertise..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {searchQuery ? `Search results for "${searchQuery}"` : "All mentors"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mentors.length} mentor{mentors.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Results Grid */}
          {mentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <div
                  key={mentor._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={mentor.profileImage || "/default-avatar.png"}
                          alt={mentor.fullName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {mentor.fullName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {mentor.professionalTitle}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                          {mentor.location}
                        </p>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {mentor.bio}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-600">
                              {mentor.yearsOfExperience} years
                            </span>
                            <span className="text-gray-600">
                              ${mentor.hourlyRate}/hr
                            </span>
                          </div>
                          {mentor.offerFreeIntro && (
                            <span className="text-green-600 text-xs font-medium">
                              Free Intro
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No mentors found
              </h3>
              <p className="text-gray-600">
                No mentors are currently available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
