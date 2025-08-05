import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "./Dashboard";
import sessionManager from "../../utils/sessionManager";

interface MenteeData {
  _id: string;
  fullName: string;
  email: string;
  profileImage: string | null;
  joinDate: string;
  preferences: string[];
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

interface MenteeDashboardProps {}

const MenteeDashboard: React.FC<MenteeDashboardProps> = () => {
  const navigate = useNavigate();
  const [menteeData, setMenteeData] = useState<MenteeData | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
  const [mentorsWorkedWith, setMentorsWorkedWith] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalMentors: 0,
    averageRating: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenteeDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/mentors/mentee/my-details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Mentee details received:", data);
        setMenteeData(data.mentee);
        setStats(data.stats);
        setUpcomingSessions(data.upcomingSessions || []);
        setCompletedSessions(data.completedSessions || []);
        setMentorsWorkedWith(data.mentorsWorkedWith || []);
        setNotifications(data.notifications || []);
      } else {
        setError("Failed to fetch mentee details");
      }
    } catch (error) {
      console.error("Error fetching mentee details:", error);
      setError("Failed to fetch mentee details");
    }
  };

  const fetchCareerServicesAsSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/resumes/career-services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Career services received:", data);
        const careerServices = data.careerServices || [];

        const sessionsData: Session[] = careerServices.map((service: any) => ({
          _id: service._id,
          title: service.title,
          description: service.description,
          status: service.status === "completed" ? "completed" : "pending",
          date: service.createdAt,
          serviceType: service.serviceType,
          linkedInUrl: service.linkedInUrl,
          resumeUrl: service.resumeUrl,
          industry: service.industry,
          experience: service.experience,
          targetRole: service.targetRole,
          priority: service.priority,
          reviewerId: service.reviewerId,
        }));

        console.log("Mapped sessions data:", sessionsData);
        setSessions(sessionsData);
      } else {
        console.error("Failed to fetch career services");
      }
    } catch (error) {
      console.error("Error fetching career services:", error);
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch("/api/auth/update-profile-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMenteeData((prev) =>
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
      await Promise.all([
        fetchMenteeDetails(),
        fetchCareerServicesAsSessions(),
      ]);
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

  if (!menteeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No mentee data found</p>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      userType="mentee"
      userData={{
        fullName: menteeData.fullName,
        email: menteeData.email,
        profileImage: menteeData.profileImage,
        joinDate: menteeData.joinDate,
        preferences: menteeData.preferences,
      }}
      stats={stats}
      sessions={sessions}
      upcomingSessions={upcomingSessions}
      completedSessions={completedSessions}
      mentorsWorkedWith={mentorsWorkedWith}
      notifications={notifications}
      onProfileImageUpload={handleProfileImageUpload}
      onLogout={handleLogout}
    />
  );
};

export default MenteeDashboard;
