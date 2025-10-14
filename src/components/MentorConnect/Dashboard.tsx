import React, { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  StarIcon,
  DollarSignIcon,
  TrendingUpIcon,
  MessageSquareIcon,
  SettingsIcon,
  LogOutIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XIcon,
} from "lucide-react";
import { ProfileImageUpload } from "../common/ProfileImageUpload";

interface Session {
  _id: string;
  title: string;
  description: string;
  status: "upcoming" | "pending" | "completed";
  date?: string;
  time?: string;
  mentor?: {
    fullName: string;
    profileImage?: string;
  };
  mentee?: {
    fullName: string;
    profileImage?: string;
  };
  serviceType?: "resume_review" | "linkedin_review";
  linkedInUrl?: string;
  resumeUrl?: string;
  industry?: string;
  experience?: string;
  targetRole?: string;
  priority?: string;
  reviewerId?: string;
}

interface DashboardProps {
  userType: "mentor" | "mentee";
  userData: {
    fullName: string;
    email: string;
    profileImage: string | null;
    title?: string;
    industry?: string;
    experience?: number;
    bio?: string;
    verificationStatus?: string;
    hourlyRate?: number;
    specialties?: string[];
    skills?: string[];
    joinDate?: string;
    preferences?: string[];
  };
  stats: {
    upcomingSessions?: number;
    averageRating?: number;
    totalEarnings?: number;
    totalSessions?: number;
    totalReviews?: number;
    completedSessions?: number;
    totalMentors?: number;
    totalSpent?: number;
  };
  sessions: Session[];
  upcomingSessions: Session[];
  completedSessions: Session[];
  recentReviews?: any[];
  notifications?: any[];
  mentorsWorkedWith?: any[];
  onProfileImageUpload: (file: File) => Promise<void>;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userType,
  userData,
  stats,
  sessions,
  upcomingSessions,
  completedSessions,
  recentReviews = [],
  notifications = [],
  mentorsWorkedWith = [],
  onProfileImageUpload,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const sessionsPerPage = 3;

  const getVisibleSessions = () => {
    const startIndex = (currentPage - 1) * sessionsPerPage;
    const endIndex = startIndex + sessionsPerPage;
    return sessions.slice(startIndex, endIndex);
  };

  const goToNextPage = () => {
    if (canGoToNextPage()) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (canGoToPreviousPage()) {
      setCurrentPage(currentPage - 1);
    }
  };

  const canGoToNextPage = () => {
    return currentPage * sessionsPerPage < sessions.length;
  };

  const canGoToPreviousPage = () => {
    return currentPage > 1;
  };

  const getPageInfo = () => {
    const totalPages = Math.ceil(sessions.length / sessionsPerPage);
    return {
      current: currentPage,
      total: totalPages,
      start: (currentPage - 1) * sessionsPerPage + 1,
      end: Math.min(currentPage * sessionsPerPage, sessions.length),
      totalItems: sessions.length,
    };
  };

  const handleSessionTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const closeSessionModal = () => {
    setShowSessionModal(false);
    setSelectedSession(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <CalendarIcon size={16} />;
      case "pending":
        return <ClockIcon size={16} />;
      case "completed":
        return <CheckCircleIcon size={16} />;
      default:
        return <AlertCircleIcon size={16} />;
    }
  };

  const renderSessionCard = (session: Session) => (
    <div
      key={session._id}
      className="bg-white rounded-lg shadow-md p-4 h-32 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleSessionClick(session)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 truncate">
          {session.title}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 flex-shrink-0 ${getStatusColor(
            session.status
          )}`}
        >
          {getStatusIcon(session.status)}
          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
        </span>
      </div>
      <p className="text-sm text-gray-600 truncate mb-2">
        {session.description}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        {session.date && (
          <span className="flex items-center gap-1">
            <CalendarIcon size={12} />
            {new Date(session.date).toLocaleDateString()}
          </span>
        )}
        {session.time && (
          <span className="flex items-center gap-1">
            <ClockIcon size={12} />
            {session.time}
          </span>
        )}
      </div>
    </div>
  );

  const renderSessionModal = () => {
    if (!selectedSession) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedSession.title}
            </h2>
            <button
              onClick={closeSessionModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <XIcon size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{selectedSession.description}</p>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  selectedSession.status
                )}`}
              >
                {selectedSession.status.charAt(0).toUpperCase() +
                  selectedSession.status.slice(1)}
              </span>
            </div>

            {selectedSession.date && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm text-gray-900">
                  {new Date(selectedSession.date).toLocaleDateString()}
                </span>
              </div>
            )}

            {selectedSession.time && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Time</span>
                <span className="text-sm text-gray-900">
                  {selectedSession.time}
                </span>
              </div>
            )}

            {selectedSession.serviceType === "resume_review" && (
              <>
                {selectedSession.industry && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Industry</span>
                    <span className="text-sm text-gray-900">
                      {selectedSession.industry}
                    </span>
                  </div>
                )}
                {selectedSession.experience && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Experience</span>
                    <span className="text-sm text-gray-900">
                      {selectedSession.experience}
                    </span>
                  </div>
                )}
                {selectedSession.targetRole && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Target Role</span>
                    <span className="text-sm text-gray-900">
                      {selectedSession.targetRole}
                    </span>
                  </div>
                )}
                {selectedSession.priority && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Priority</span>
                    <span className="text-sm text-gray-900">
                      {selectedSession.priority}
                    </span>
                  </div>
                )}
                {selectedSession.resumeUrl && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Resume</span>
                    <a
                      href={selectedSession.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </>
            )}

            {selectedSession.serviceType === "linkedin_review" && (
              <>
                {selectedSession.linkedInUrl && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">LinkedIn URL</span>
                    <a
                      href={selectedSession.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                )}
              </>
            )}

            {userType === "mentee" && selectedSession.mentor && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Mentor</span>
                <span className="text-sm text-gray-900">
                  {selectedSession.mentor.fullName}
                </span>
              </div>
            )}

            {userType === "mentor" && selectedSession.mentee && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Mentee</span>
                <span className="text-sm text-gray-900">
                  {selectedSession.mentee.fullName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ProfileImageUpload
                profileImage={userData.profileImage}
                fullName={userData.fullName}
                onImageUpload={onProfileImageUpload}
                size="md"
                className=""
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.fullName}
                </h1>
                <p className="text-gray-600">{userData.email}</p>
                {userData.title && (
                  <p className="text-sm text-gray-500">{userData.title}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {userType === "mentor"
                    ? "Upcoming Sessions"
                    : "Total Sessions"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userType === "mentor"
                    ? stats.upcomingSessions || 0
                    : stats.totalSessions || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {userType === "mentor"
                    ? "Total Earnings"
                    : "Completed Sessions"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userType === "mentor"
                    ? `$${stats.totalEarnings || 0}`
                    : stats.completedSessions || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {userType === "mentor" ? "Average Rating" : "Total Mentors"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userType === "mentor"
                    ? `${stats.averageRating || 0}/5`
                    : stats.totalMentors || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUpIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {userType === "mentor" ? "Total Reviews" : "Total Spent"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {userType === "mentor"
                    ? stats.totalReviews || 0
                    : `$${stats.totalSpent || 0}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => handleSessionTabChange("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleSessionTabChange("sessions")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "sessions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Sessions
              </button>
              {userType === "mentee" && (
                <button
                  onClick={() => handleSessionTabChange("mentors")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "mentors"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Mentors
                </button>
              )}
              <button
                onClick={() => handleSessionTabChange("notifications")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "notifications"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Notifications
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getVisibleSessions().map(renderSessionCard)}
                  </div>
                  {sessions.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Page {pageInfo.current} of {pageInfo.total} (
                        {pageInfo.start}-{pageInfo.end} of {pageInfo.totalItems}
                        )
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={goToPreviousPage}
                          disabled={!canGoToPreviousPage()}
                          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={goToNextPage}
                          disabled={!canGoToNextPage()}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "sessions" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    All Sessions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getVisibleSessions().map(renderSessionCard)}
                  </div>
                  {sessions.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Page {pageInfo.current} of {pageInfo.total} (
                        {pageInfo.start}-{pageInfo.end} of {pageInfo.totalItems}
                        )
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={goToPreviousPage}
                          disabled={!canGoToPreviousPage()}
                          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={goToNextPage}
                          disabled={!canGoToNextPage()}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "mentors" && userType === "mentee" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Mentors You've Worked With
                  </h3>
                  {mentorsWorkedWith.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mentorsWorkedWith.map((mentor) => (
                        <div
                          key={mentor._id}
                          className="bg-white border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              {mentor.profileImage ? (
                                <img
                                  src={mentor.profileImage}
                                  alt={mentor.fullName}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-500 font-medium">
                                  {mentor.fullName.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {mentor.fullName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {mentor.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No mentors worked with yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Notifications
                  </h3>
                  {notifications.length > 0 ? (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className="bg-white border border-gray-200 rounded-lg p-4"
                        >
                          <h4 className="font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No notifications yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {renderSessionModal()}
    </div>
  );
};
