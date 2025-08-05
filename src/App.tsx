import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";

// Career Boost Components
import { CareerHome } from "./components/CareerBoost/CareerHome";
import { GetReferral } from "./components/CareerBoost/GetReferral";
import { InterviewPrep } from "./components/CareerBoost/InterviewPrep";
import { LinkedInFix } from "./components/CareerBoost/LinkedInFix";
import { ResumeReview } from "./components/CareerBoost/ResumeReview";

// Mentor Connect Components
import { MentorHome } from "./components/MentorConnect/MentorHome";
import { MentorSignIn } from "./components/MentorConnect/MentorSignIn";
import { MentorSignUp } from "./components/MentorConnect/MentorSignUp";
import { Dashboard } from "./components/MentorConnect/Dashboard";
import MentorDashboard from "./components/MentorConnect/MentorDashboard";
import MenteeDashboard from "./components/MentorConnect/MenteeDashboard";
import { MentorApplication } from "./components/MentorConnect/MentorApplication";
import { AllCategories } from "./components/MentorConnect/AllCategories";
import { EmailVerification } from "./components/MentorConnect/EmailVerification";
import { MentorPending } from "./components/MentorPending";
import { LinkedInCallback } from "./components/MentorConnect/LinkedInCallback";

// Insight Board Components
import { InsightHome } from "./components/InsightBoard/InsightHome";

// Dashboard Wrapper Component
const DashboardRouter = () => {
  const [userType, setUserType] = useState<"mentor" | "mentee" | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkUserType = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // First check if user is a mentor
        const mentorResponse = await fetch("/api/mentors/my-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (mentorResponse.ok) {
          const mentorData = await mentorResponse.json();
          if (mentorData.mentor) {
            setUserType("mentor");
            setLoading(false);
            return;
          }
        }

        // If not a mentor, check if user is a mentee
        const menteeResponse = await fetch("/api/mentors/mentee/my-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (menteeResponse.ok) {
          const menteeData = await menteeResponse.json();
          if (menteeData.mentee) {
            setUserType("mentee");
            setLoading(false);
            return;
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error checking user type:", error);
        setLoading(false);
      }
    };

    checkUserType();
  }, [token]);

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

  if (!token) {
    return <div>Please log in to access your dashboard.</div>;
  }

  if (userType === "mentor") {
    return <MentorDashboard />;
  }

  if (userType === "mentee") {
    return <MenteeDashboard />;
  }

  return <div>Unable to determine user type. Please contact support.</div>;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Career Boost Routes */}
          <Route path="/career-boost" element={<CareerHome />} />
          <Route
            path="/career-boost/resume-review"
            element={<ResumeReview />}
          />
          <Route path="/career-boost/linkedin-fix" element={<LinkedInFix />} />
          <Route
            path="/career-boost/interview-prep"
            element={<InterviewPrep />}
          />
          <Route path="/career-boost/get-referral" element={<GetReferral />} />

          {/* Mentor Connect Routes */}
          <Route path="/mentor-connect" element={<MentorHome />} />
          <Route path="/mentor-signin" element={<MentorSignIn />} />
          <Route path="/mentor-signup" element={<MentorSignUp />} />
          <Route path="/mentor-application" element={<MentorApplication />} />
          <Route path="/all-categories" element={<AllCategories />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/mentor-dashboard" element={<MentorDashboard />} />
          <Route path="/mentee-dashboard" element={<MenteeDashboard />} />
          <Route path="/mentor-pending" element={<MentorPending />} />
          <Route path="/linkedin-callback" element={<LinkedInCallback />} />

          {/* Insight Board Routes */}
          <Route path="/insight-board" element={<InsightHome />} />

          <Route
            path="/test"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-green-600">
                  Test Route Working! ✅
                </h1>
                <p className="mt-4">Routing is working correctly.</p>
              </div>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
