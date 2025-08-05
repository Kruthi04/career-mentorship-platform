import React from "react";
import { Link } from "react-router-dom";
import { UserIcon, FileTextIcon, StarIcon } from "lucide-react";
export const HomePage = () => {
  return (
    <div className="w-full bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative bg-royal-blue text-white py-16 md:py-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="People collaborating"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-royal-blue opacity-75"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Accelerate your career with the right experts, tools, and insights.
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 text-sail">
            Discover mentors, improve your job applications, and make informed
            software decisions all in one place.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/mentor-connect"
              className="px-6 py-3 bg-white text-royal-blue font-semibold rounded-md hover:bg-sail"
            >
              Get Started
            </Link>
            <Link
              to="#platforms"
              className="px-6 py-3 bg-mariner text-white font-semibold rounded-md hover:bg-royal-blue"
            >
              Explore Platforms
            </Link>
          </div>
        </div>
      </section>
      {/* Platforms Section */}
      <section id="platforms" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
            Choose the right platform for your needs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* MentorConnect Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
              <div className="h-3 bg-mariner"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-sail rounded-full flex items-center justify-center mb-4">
                  <UserIcon size={24} className="text-mariner" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  MentorConnect
                </h3>
                <p className="text-gray-600 mb-6">
                  Find mentors for free guidance on your career journey.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-mariner">✓</span> 1:1 Mentorship
                    Sessions
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-mariner">✓</span> Free Initial
                    Consultations
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-mariner">✓</span> Expert Industry
                    Professionals
                  </li>
                </ul>
                <Link
                  to="/mentor-connect"
                  className="block w-full text-center py-2 bg-mariner text-white rounded-md hover:bg-royal-blue"
                >
                  Find a Mentor
                </Link>
              </div>
            </div>
            {/* CareerBoost Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
              <div className="h-3 bg-royal-blue"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-sail rounded-full flex items-center justify-center mb-4">
                  <FileTextIcon size={24} className="text-royal-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  CareerBoost
                </h3>
                <p className="text-gray-600 mb-6">
                  Resume & job preparation help to land your dream role.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-royal-blue">✓</span> Resume
                    Reviews
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-royal-blue">✓</span> LinkedIn
                    Profile Optimization
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-royal-blue">✓</span> Interview
                    Preparation
                  </li>
                </ul>
                <Link
                  to="/career-boost"
                  className="block w-full text-center py-2 bg-royal-blue text-white rounded-md hover:bg-mariner"
                >
                  Boost Your Career
                </Link>
              </div>
            </div>
            {/* InsightBoard Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
              <div className="h-3 bg-lynch"></div>
              <div className="p-6">
                <div className="w-12 h-12 bg-sail rounded-full flex items-center justify-center mb-4">
                  <StarIcon size={24} className="text-lynch" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  InsightBoard
                </h3>
                <p className="text-gray-600 mb-6">
                  Software reviews by real users to make informed decisions.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-lynch">✓</span> Authentic User
                    Reviews
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-lynch">✓</span> Expert Opinions
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-lynch">✓</span> Compare Software
                    Solutions
                  </li>
                </ul>
                <Link
                  to="/insight-board"
                  className="block w-full text-center py-2 bg-lynch text-white rounded-md hover:bg-mariner"
                >
                  Read Reviews
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
            Why choose CareerHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sail rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-mariner"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Verified Experts
              </h3>
              <p className="text-gray-600">
                All mentors are verified professionals with real industry
                experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sail rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-royal-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Time-Saving
              </h3>
              <p className="text-gray-600">
                Get all your career resources in one place instead of scattered
                across the web.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sail rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-lynch"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Trusted Reviews
              </h3>
              <p className="text-gray-600">
                Real reviews from verified users to help you make informed
                decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-royal-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Ready to accelerate your career?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-8 text-sail">
            Join thousands of professionals who have found success through our
            platforms.
          </p>
          <Link
            to="/mentor-signup"
            className="px-8 py-3 bg-white text-royal-blue font-semibold rounded-md hover:bg-sail inline-block"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
};
