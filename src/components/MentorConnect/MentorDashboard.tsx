import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  ClockIcon,
  StarIcon,
  DollarSignIcon,
  UsersIcon,
  MessageSquareIcon,
  BellIcon,
  SettingsIcon,
  UserIcon,
  TrendingUpIcon,
  AwardIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  EditIcon,
  CameraIcon,
} from "lucide-react";

interface MentorData {
  mentor: {
    _id: string;
    fullName: string;
    email: string;
    title: string;
    industry: string;
    experience: number;
    bio: string;
    profileImage: string | null;
    verificationStatus: string;
    hourlyRate: number;
    specialties: string[];
    skills: string[];
  };
  stats: {
    upcomingSessions: number;
    averageRating: number;
    totalEarnings: number;
    totalSessions: number;
    totalReviews: number;
  };
  upcomingSessions: any[];
  recentReviews: any[];
  notifications: any[];
}

export const MentorDashboard = () => {
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const fetchMentorDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("token");

      console.log("User from localStorage:", user);
      console.log("Token from localStorage:", token ? "Present" : "Missing");

      if (!user || !token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      console.log("Making API call to:", `/api/mentors/my-details`);

      const response = await fetch(`/api/mentors/my-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Failed to fetch mentor details");
      }

      const data = await response.json();
      console.log("Success response:", data);
      setMentorData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching mentor details:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorDetails();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (JPEG, PNG, GIF, etc.)");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("profileImage", file);

        console.log("Uploading image:", file.name);
        console.log("File size:", file.size);
        console.log("File type:", file.type);

        const response = await fetch("/api/mentors/profile-image", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type header - let the browser set it with boundary
          },
          body: formData,
        });

        console.log("Upload response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Upload success:", data);

          // Update the mentor data with new image
          setMentorData((prev) =>
            prev
              ? {
                  ...prev,
                  mentor: {
                    ...prev.mentor,
                    profileImage: data.profileImage,
                  },
                }
              : null
          );
          setShowImageUpload(false);
          alert("Profile image updated successfully!");

          // Refresh mentor data to get the latest information
          fetchMentorDetails();
        } else {
          const errorData = await response.json();
          console.error("Upload failed:", errorData);
          alert(
            "Failed to upload image: " + (errorData.message || "Unknown error")
          );
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
      }
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircleIcon size={16} className="text-green-500" />;
      case "pending":
        return <ClockIcon size={16} className="text-yellow-500" />;
      default:
        return <AlertCircleIcon size={16} className="text-red-500" />;
    }
  };

  const getVerificationText = (status: string) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "pending":
        return "Pending Verification";
      default:
        return "Not Verified";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircleIcon size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/mentor-connect"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to MentorConnect
          </Link>
        </div>
      </div>
    );
  }

  if (!mentorData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Data</h2>
          <p className="text-gray-600 mb-4">No mentor data found.</p>
          <Link
            to="/mentor-connect"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to MentorConnect
          </Link>
        </div>
      </div>
    );
  }

  const { mentor, stats, upcomingSessions, recentReviews, notifications } =
    mentorData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/mentor-connect"
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to MentorConnect
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Mentor Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <BellIcon size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <SettingsIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Profile Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {mentor.profileImage ? (
                      <img
                        src={mentor.profileImage}
                        alt={mentor.fullName}
                        className="w-full h-full object-cover"
                        onLoad={() => {
                          console.log(
                            "Image loaded successfully:",
                            mentor.profileImage
                          );
                        }}
                        onError={(e) => {
                          console.error(
                            "Image failed to load:",
                            mentor.profileImage
                          );
                          console.error("Full image URL:", mentor.profileImage);
                          // Hide the image and show the fallback icon
                          const target = e.currentTarget;
                          target.style.display = "none";
                          // Find the fallback icon and show it
                          const fallbackIcon =
                            target.parentElement?.querySelector(
                              ".fallback-icon"
                            );
                          if (fallbackIcon) {
                            fallbackIcon.classList.remove("hidden");
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className={`fallback-icon ${
                        mentor.profileImage ? "hidden" : ""
                      }`}
                    >
                      {mentor.fullName ? (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold text-lg">
                          {mentor.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                      ) : (
                        <UserIcon size={32} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowImageUpload(true)}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                  >
                    <CameraIcon size={12} />
                  </button>
                </div>

                {showImageUpload && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Upload Profile Image
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Please select an image file (JPEG, PNG, GIF). Maximum
                        file size: 5MB.
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowImageUpload(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowImageUpload(false)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Profile Modal */}
                {showEditProfile && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Edit Profile
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Profile editing functionality is coming soon! This would
                        allow you to update your:
                      </p>
                      <ul className="text-sm text-gray-600 mb-4 list-disc list-inside">
                        <li>Professional title</li>
                        <li>Bio and description</li>
                        <li>Areas of expertise</li>
                        <li>Skills and certifications</li>
                        <li>Hourly rate</li>
                        <li>Availability schedule</li>
                      </ul>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowEditProfile(false)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowEditProfile(false)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <h2 className="text-xl font-semibold text-gray-900 mt-4">
                  {mentor.fullName}
                </h2>
                <p className="text-gray-600">{mentor.title}</p>

                {/* Verification Status */}
                <div className="flex items-center justify-center mt-2">
                  {getVerificationIcon(mentor.verificationStatus)}
                  <span className="ml-1 text-sm text-gray-600">
                    {getVerificationText(mentor.verificationStatus)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hourly Rate</span>
                  <span className="font-semibold">${mentor.hourlyRate}/hr</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience</span>
                  <span className="font-semibold">
                    {mentor.experience} years
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Industry</span>
                  <span className="font-semibold">{mentor.industry}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={handleEditProfile}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <EditIcon size={16} className="mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "overview"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("sessions")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "sessions"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Sessions
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "reviews"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab("earnings")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "earnings"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Earnings
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CalendarIcon size={20} className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Upcoming Sessions
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.upcomingSessions}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <StarIcon size={20} className="text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Average Rating
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.averageRating > 0
                            ? stats.averageRating.toFixed(1)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSignIcon size={20} className="text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Earnings
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          ${stats.totalEarnings}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <UsersIcon size={20} className="text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Sessions
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stats.totalSessions}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Sessions */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Upcoming Sessions
                    </h3>
                  </div>
                  <div className="p-6">
                    {upcomingSessions.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingSessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {session.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                with {session.menteeName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {session.date} at {session.time}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {session.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CalendarIcon
                          size={48}
                          className="text-gray-400 mx-auto mb-4"
                        />
                        <p className="text-gray-600">No upcoming sessions</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Reviews
                    </h3>
                  </div>
                  <div className="p-6">
                    {recentReviews.length > 0 ? (
                      <div className="space-y-4">
                        {recentReviews.map((review) => (
                          <div
                            key={review.id}
                            className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
                          >
                            <img
                              src={review.reviewerImage}
                              alt={review.reviewerName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  {review.reviewerName}
                                </h4>
                                <div className="flex items-center">
                                  <StarIcon
                                    size={16}
                                    className="text-yellow-400"
                                  />
                                  <span className="ml-1 text-sm font-medium">
                                    {review.rating}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {review.comment}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {review.date}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <StarIcon
                          size={48}
                          className="text-gray-400 mx-auto mb-4"
                        />
                        <p className="text-gray-600">No reviews yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sessions" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  All Sessions
                </h3>
                <p className="text-gray-600">
                  Sessions management coming soon...
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  All Reviews
                </h3>
                <p className="text-gray-600">
                  Reviews management coming soon...
                </p>
              </div>
            )}

            {activeTab === "earnings" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Earnings Overview
                </h3>
                <p className="text-gray-600">
                  Earnings management coming soon...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
