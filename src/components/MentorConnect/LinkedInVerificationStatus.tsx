import React, { useState, useEffect } from "react";
import {
  LinkedinIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  AlertCircleIcon,
} from "lucide-react";

interface LinkedInVerificationStatusProps {
  userId: string;
  linkedInUrl?: string;
  onStatusUpdate?: (status: string) => void;
}

export const LinkedInVerificationStatus: React.FC<
  LinkedInVerificationStatusProps
> = ({ userId, linkedInUrl, onStatusUpdate }) => {
  const [status, setStatus] = useState<string>("not_initiated");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/linkedin/status/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const status = data.verified ? "verified" : "not_initiated";
        setStatus(status);
        setProfileData(data.profile);
        onStatusUpdate?.(status);
      } else {
        setError(data.message || "Failed to check verification status");
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      setError("Network error while checking status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      checkStatus();
    }
  }, [userId]);

  const getStatusIcon = () => {
    switch (status) {
      case "verified":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "connected":
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "failed":
      case "expired":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "verified":
        return "Verified";
      case "connected":
        return "Connected";
      case "pending":
        return "Pending Verification";
      case "failed":
        return "Verification Failed";
      case "expired":
        return "Connection Expired";
      case "not_initiated":
        return "Not Verified";
      default:
        return "Unknown Status";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "verified":
        return "text-green-700 bg-green-50 border-green-200";
      case "connected":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "pending":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "failed":
      case "expired":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case "verified":
        return "Your LinkedIn profile has been successfully verified.";
      case "connected":
        return "Your LinkedIn profile is connected and being verified.";
      case "pending":
        return "Your LinkedIn verification is in progress. This may take a few minutes.";
      case "failed":
        return "LinkedIn verification failed. Please try again.";
      case "expired":
        return "Your LinkedIn connection has expired. Please reconnect.";
      case "not_initiated":
        return "LinkedIn verification has not been initiated yet.";
      default:
        return "Verification status is unknown.";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <LinkedinIcon className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            LinkedIn Verification
          </h3>
        </div>
        <button
          onClick={checkStatus}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Refresh"}
        </button>
      </div>

      <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
        <div className="flex items-center space-x-3 mb-2">
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
        <p className="text-sm">{getStatusDescription()}</p>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {profileData && status === "verified" && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">
            Profile Information
          </h4>
          <div className="space-y-2 text-sm">
            {profileData.headline && (
              <div>
                <span className="font-medium text-green-800">Headline:</span>{" "}
                <span className="text-green-700">{profileData.headline}</span>
              </div>
            )}
            {profileData.current_company && (
              <div>
                <span className="font-medium text-green-800">Company:</span>{" "}
                <span className="text-green-700">
                  {profileData.current_company}
                </span>
              </div>
            )}
            {profileData.current_position && (
              <div>
                <span className="font-medium text-green-800">Position:</span>{" "}
                <span className="text-green-700">
                  {profileData.current_position}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {linkedInUrl && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="font-medium">LinkedIn URL:</span>{" "}
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              {linkedInUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};
