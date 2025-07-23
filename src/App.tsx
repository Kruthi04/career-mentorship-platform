import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { MentorHome } from "./components/MentorConnect/MentorHome";
import { MentorSignUp } from "./components/MentorConnect/MentorSignUp";
import { MentorSignIn } from "./components/MentorConnect/MentorSignIn";
import { MentorApplication } from "./components/MentorConnect/MentorApplication";
import { MentorDashboard } from "./components/MentorConnect/MentorDashboard";
import { AllCategories } from "./components/MentorConnect/AllCategories";
import { CategoryMentors } from "./components/MentorConnect/CategoryMentors";
import { CareerHome } from "./components/CareerBoost/CareerHome";
import { InsightHome } from "./components/InsightBoard/InsightHome";
import { ResumeReview } from "./components/CareerBoost/ResumeReview";
import { LinkedInFix } from "./components/CareerBoost/LinkedInFix";
import { InterviewPrep } from "./components/CareerBoost/InterviewPrep";
import { GetReferral } from "./components/CareerBoost/GetReferral";
import { ScrollToTop } from "./components/ScrollToTop";

export function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* MentorConnect Routes */}
            <Route path="/mentor-connect" element={<MentorHome />} />
            <Route path="/mentor-connect/signup" element={<MentorSignUp />} />
            <Route path="/mentor-connect/signin" element={<MentorSignIn />} />
            <Route
              path="/mentor-connect/apply"
              element={<MentorApplication />}
            />
            <Route
              path="/mentor-connect/dashboard"
              element={<MentorDashboard />}
            />
            <Route
              path="/mentor-connect/categories"
              element={<AllCategories />}
            />
            <Route
              path="/mentor-connect/categories/:categoryId"
              element={<CategoryMentors />}
            />
            {/* CareerBoost Routes */}
            <Route path="/career-boost" element={<CareerHome />} />
            <Route
              path="/career-boost/resume-review"
              element={<ResumeReview />}
            />

            <Route
              path="/career-boost/linkedin-fix"
              element={<LinkedInFix />}
            />
            <Route
              path="/career-boost/interview-prep"
              element={<InterviewPrep />}
            />
            <Route
              path="/career-boost/get-referral"
              element={<GetReferral />}
            />
            {/* InsightBoard Routes */}
            <Route path="/insight-board" element={<InsightHome />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
