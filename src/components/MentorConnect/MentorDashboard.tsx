import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import sessionManager from "../../utils/sessionManager";

interface MentorData {
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
}

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

interface MentorDashboardProps {}

const MentorDashboard: React.FC<MentorDashboardProps> = () => {
  const navigate = useNavigate();
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    upcomingSessions: 0,
    averageRating: 0,
    totalEarnings: 0,
    totalSessions: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMentorDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/mentors/my-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMentorData(data.mentor);
        setStats(data.stats);
        setUpcomingSessions(data.upcomingSessions || []);
        setCompletedSessions(data.completedSessions || []);
        setRecentReviews(data.recentReviews || []);
        setNotifications(data.notifications || []);

        // Combine all sessions for the sessions array
        const allSessions = [
          ...(data.upcomingSessions || []),
          ...(data.completedSessions || []),
          ...(data.recentReviews || []),
        ];
        setSessions(allSessions);
      } else {
        setError("Failed to fetch mentor details");
      }
    } catch (error) {
      console.error("Error fetching mentor details:", error);
      setError("Failed to fetch mentor details");
    }
  };

  const fetchMentorSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/sessions/mentor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // The backend returns sessions.all, sessions.pending, sessions.upcoming, sessions.completed
        setSessions(data.sessions?.all || []);
      } else {
        console.error("Failed to fetch mentor sessions");
      }
    } catch (error) {
      console.error("Error fetching mentor sessions:", error);
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch("/api/mentors/profile-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMentorData((prev) =>
          prev
            ? {
                ...prev,
                profileImage: data.profileImage,
              }
            : null
        );
        alert("Profile image updated successfully!");
      } else {
        alert("Failed to update profile image");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Error uploading profile image");
    }
  };

  const handleLogout = () => {
    sessionManager.logout();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchMentorDetails(), fetchMentorSessions()]);
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

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
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!mentorData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No mentor data found</p>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      userType="mentor"
      userData={{
        fullName: mentorData.fullName,
        email: mentorData.email,
        profileImage: mentorData.profileImage,
        title: mentorData.title,
        industry: mentorData.industry,
        experience: mentorData.experience,
        bio: mentorData.bio,
        verificationStatus: mentorData.verificationStatus,
        hourlyRate: mentorData.hourlyRate,
        specialties: mentorData.specialties,
        skills: mentorData.skills,
      }}
      stats={stats}
      sessions={sessions}
      upcomingSessions={upcomingSessions}
      completedSessions={completedSessions}
      recentReviews={recentReviews}
      notifications={notifications}
      onProfileImageUpload={handleProfileImageUpload}
      onLogout={handleLogout}
    />
  );
};

export default MentorDashboard;
