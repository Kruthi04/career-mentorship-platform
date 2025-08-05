import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  ShieldIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "lucide-react";
import sessionManager from "../../utils/sessionManager";
import ApiClient from "../../utils/apiClient";

export const MentorSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user wants to become a mentor
  const wantsToBecomeMentor = location.state?.wantsToBecomeMentor;

  // Test API client on component mount
  useEffect(() => {
    const testApiClient = async () => {
      try {
        console.log("Testing API client connection...");
        setDebugInfo("Testing connection to backend...");

        const response = await ApiClient.get("/auth/session");
        console.log("API client test successful:", response.status);
        setDebugInfo("Backend connection successful");

        // Clear debug info after 3 seconds
        setTimeout(() => setDebugInfo(""), 3000);
      } catch (error) {
        console.error("API client test failed:", error);
        setDebugInfo(
          `Connection test failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );

        // Clear debug info after 5 seconds
        setTimeout(() => setDebugInfo(""), 5000);
      }
    };
    testApiClient();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setDebugInfo("Attempting to login...");

    try {
      console.log("Attempting to login with email:", email);

      // Test backend connection first
      try {
        const testResponse = await fetch(
          "http://localhost:5050/api/auth/session"
        );
        console.log("Backend test response:", testResponse.status);
        if (!testResponse.ok) {
          throw new Error(`Backend test failed: ${testResponse.status}`);
        }
      } catch (testError) {
        console.error("Backend connection test failed:", testError);
        setError(
          "Cannot connect to server. Please ensure the backend is running on port 5050."
        );
        setIsLoading(false);
        return;
      }

      const response = await ApiClient.post("/auth/login", { email, password });
      console.log("Login response status:", response.status);

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        // Start session management
        sessionManager.startSession();

        // Navigate based on user type and intent
        if (data.user.isMentor) {
          navigate("/mentor-dashboard");
        } else if (wantsToBecomeMentor) {
          navigate("/mentor-application");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(`Network error: ${err.message}`);
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
      setDebugInfo("");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-50 to-white"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-1/4 left-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">{debugInfo}</p>
          </div>
        )}

        {/* Mentor Notice */}
        {wantsToBecomeMentor && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Become a Mentor
                </h3>
                <p className="text-sm text-blue-800">
                  Complete your mentor application to start helping others grow
                  their careers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <ShieldIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Sign In Error
                    </h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign In
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </div>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/mentor-signup"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
