import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "lucide-react";

export const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setVerificationStatus("error");
        setMessage("No verification token found in the URL.");
        return;
      }

      try {
        const response = await fetch(`/api/mentors/verify-email/${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setVerificationStatus("success");
          setMessage(data.message);
        } else {
          setVerificationStatus("error");
          setMessage(data.message || "Verification failed");
        }
      } catch (error) {
        setVerificationStatus("error");
        setMessage("Network error. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleContinue = () => {
    navigate("/mentor-connect/dashboard");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            {verificationStatus === "loading" && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Verifying Your Email
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {verificationStatus === "success" && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Email Verified!
                </h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleContinue}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={handleGoHome}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Home
                  </button>
                </div>
              </>
            )}

            {verificationStatus === "error" && (
              <>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="mt-6 text-3xl font-bold text-gray-900">
                  Verification Failed
                </h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <div className="mt-6">
                  <button
                    onClick={handleGoHome}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
