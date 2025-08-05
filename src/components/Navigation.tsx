import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MenuIcon,
  XIcon,
  ChevronDownIcon,
  UserIcon,
  StarIcon,
  TrendingUpIcon,
  FileTextIcon,
  SettingsIcon,
  HomeIcon,
  BookOpenIcon,
  MessageCircleIcon,
  BellIcon,
} from "lucide-react";
import sessionManager from "../utils/sessionManager";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    if (isMenuOpen || isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isNotificationsOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionManager.logout();
  };

  const getCurrentPlatform = () => {
    if (location.pathname.startsWith("/mentor-connect")) {
      return "mentor-connect";
    } else if (location.pathname.startsWith("/career-boost")) {
      return "career-boost";
    } else if (location.pathname.startsWith("/insight-board")) {
      return "insight-board";
    }
    return "home";
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProductsOpen(false);
  };

  const handleBecomeMentor = () => {
    if (user?.isMentor) {
      navigate("/dashboard");
    } else if (user) {
      navigate("/mentor-application");
    } else {
      navigate("/mentor-signin", {
        state: { wantsToBecomeMentor: true },
      });
    }
  };

  return (
    <header className="bg-white z-40 sticky top-0 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 flex items-center"
          >
            <span className="text-blue-600 mr-1">Career</span>
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded">
              Hub
            </span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block relative w-full max-w-xs mx-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder={
                getCurrentPlatform() === "insight-board"
                  ? "Search for software, tools, or platforms..."
                  : "Search by skill, industry, or mentor name"
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Right Side - User Info and Auth */}
          <div className="flex items-center space-x-4">
            {/* Welcome Message or Auth Buttons */}
            {user ? (
              <>
                <span className="text-gray-700 font-medium text-sm">
                  Welcome, {user.name}!
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/mentor-signin"
                  className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/mentor-signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Notifications Icon */}
            {user && (
              <div className="relative" ref={notificationsRef}>
                <button
                  className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <BellIcon size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <BellIcon size={16} className="text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              New session request
                            </p>
                            <p className="text-sm text-gray-600">
                              John Smith requested a career guidance session
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              2 hours ago
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <StarIcon size={16} className="text-green-600" />
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              New review
                            </p>
                            <p className="text-sm text-gray-600">
                              Sarah Johnson left a 5-star review
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              1 day ago
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <TrendingUpIcon
                                size={16}
                                className="text-yellow-600"
                              />
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              Profile verification
                            </p>
                            <p className="text-sm text-gray-600">
                              Your mentor profile has been verified
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              2 days ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger Menu Button */}
            <button
              ref={buttonRef}
              className="w-10 h-10 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <MenuIcon size={20} className="text-blue-600" />
            </button>
          </div>
        </nav>

        {/* Menu Panel - Popup Style */}
        {isMenuOpen && (
          <div
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200"
            ref={menuRef}
          >
            <div className="p-4 space-y-2">
              {/* Search Bar for Mobile */}
              <div className="md:hidden mb-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder={
                      getCurrentPlatform() === "insight-board"
                        ? "Search for software, tools, or platforms..."
                        : "Search by skill, industry, or mentor name"
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Main Navigation Links */}
              <Link
                to="/"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-md font-medium transition-colors ${
                  isActive("/")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                <HomeIcon size={20} className="inline mr-3" /> Home
              </Link>

              <Link
                to="/mentor-connect"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-md font-medium transition-colors ${
                  isActive("/mentor-connect")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                <StarIcon size={20} className="inline mr-3" /> MentorConnect
              </Link>

              <Link
                to="/career-boost"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-md font-medium transition-colors ${
                  isActive("/career-boost")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                <BookOpenIcon size={20} className="inline mr-3" /> CareerBoost
              </Link>

              <Link
                to="/insight-board"
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-md font-medium transition-colors ${
                  isActive("/insight-board")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                <MessageCircleIcon size={20} className="inline mr-3" />{" "}
                InsightBoard
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-200 my-3"></div>

              {/* Dashboard for all logged-in users */}
              {user && (
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-md font-medium transition-colors ${
                    isActive("/dashboard") || isActive("/mentor-dashboard")
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-green-50"
                  }`}
                >
                  <SettingsIcon size={20} className="inline mr-3" /> Dashboard
                </Link>
              )}

              {/* MentorConnect specific */}
              {getCurrentPlatform() === "mentor-connect" && (
                <>
                  {!user?.isMentor && (
                    <button
                      onClick={() => {
                        closeMenu();
                        handleBecomeMentor();
                      }}
                      className="block w-full text-left px-4 py-3 rounded-md font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <StarIcon size={20} className="inline mr-3" /> Become a
                      Mentor
                    </button>
                  )}
                </>
              )}

              {/* User Authentication Section */}
              <div className="border-t border-gray-200 pt-3">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-600">
                      Welcome, {user.name}!
                    </div>

                    {/* Notifications for Mobile */}
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(!isNotificationsOpen);
                        closeMenu();
                      }}
                      className="block w-full text-left px-4 py-3 rounded-md font-medium text-gray-700 hover:bg-blue-50 transition-colors"
                    >
                      <BellIcon size={20} className="inline mr-3" />
                      Notifications
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        3
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="block w-full text-left px-4 py-3 rounded-md font-medium text-gray-700 hover:bg-red-50 transition-colors"
                    >
                      <UserIcon size={20} className="inline mr-3" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/mentor-signin"
                      onClick={closeMenu}
                      className="block px-4 py-3 rounded-md font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <UserIcon size={20} className="inline mr-3" /> Sign In
                    </Link>
                    <Link
                      to="/mentor-signup"
                      onClick={closeMenu}
                      className="block px-4 py-3 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <UserIcon size={20} className="inline mr-3" /> Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
