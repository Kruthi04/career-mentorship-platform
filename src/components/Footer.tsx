import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleBecomeMentor = () => {
    if (user) {
      navigate("/mentor-application");
    } else {
      navigate("/mentor-signin", {
        state: { wantsToBecomeMentor: true },
      });
    }
  };

  const handleMentorAction = () => {
    if (user?.isMentor) {
      navigate("/mentor-dashboard");
    } else {
      handleBecomeMentor();
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-blue-600 mb-4">CareerHub</h3>
            <p className="text-gray-600">
              Accelerate your career with the right experts, tools, and
              insights.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">MentorConnect</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/mentor-connect"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Find a Mentor
                </Link>
              </li>
              <li>
                <button
                  onClick={handleMentorAction}
                  className="text-gray-600 hover:text-blue-600 text-left"
                >
                  {user?.isMentor ? "Dashboard" : "Become a Mentor"}
                </button>
              </li>
              <li>
                <Link
                  to="/all-categories"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Explore Categories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">CareerBoost</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/career-boost"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Resume Review
                </Link>
              </li>
              <li>
                <Link
                  to="/career-boost"
                  className="text-gray-600 hover:text-blue-600"
                >
                  LinkedIn Profile Fix
                </Link>
              </li>
              <li>
                <Link
                  to="/career-boost"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Interview Prep
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">InsightBoard</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/insight-board"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Write a Review
                </Link>
              </li>
              <li>
                <Link
                  to="/insight-board"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/insight-board"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Top Products
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600">
          <p>© 2025 CareerHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
