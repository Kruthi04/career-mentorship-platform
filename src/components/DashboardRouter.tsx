import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardRouterProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  isMentor: boolean;
  mentorId?: string;
}

interface DashboardData {
  dashboardType: "user" | "mentor" | "mentor-pending";
  user: User;
  mentorData?: any;
}

export const DashboardRouter: React.FC<DashboardRouterProps> = ({
  children,
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5050/api/auth/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
          console.log("Dashboard data:", data);

          // Only redirect if we're on the dashboard route
          const currentPath = window.location.pathname;
          if (currentPath === "/dashboard") {
            if (data.dashboardType === "mentor") {
              navigate("/mentor-dashboard");
            } else if (data.dashboardType === "mentor-pending") {
              navigate("/mentor-pending");
            } else {
              navigate("/user-dashboard");
            }
          }
        } else {
          console.error("Dashboard API error:", response.status);
          setError("Failed to get dashboard data");
        }
      } catch (err) {
        console.error("Dashboard check error:", err);
        setError("Error checking dashboard status");
      } finally {
        setLoading(false);
      }
    };

    checkUserDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
