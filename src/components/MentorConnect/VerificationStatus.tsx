import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AlertCircleIcon,
} from "lucide-react";

interface VerificationStatusProps {
  status: "pending" | "verified" | "rejected" | "unverified";
  showIcon?: boolean;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  status,
  showIcon = true,
  showLabel = true,
  size = "md",
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "verified":
        return {
          icon: (
            <CheckCircleIcon
              size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
              className="text-green-500"
            />
          ),
          color: "text-green-600 bg-green-50 border-green-200",
          label: "Verified",
          dotColor: "bg-green-500",
        };
      case "rejected":
        return {
          icon: (
            <XCircleIcon
              size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
              className="text-red-500"
            />
          ),
          color: "text-red-600 bg-red-50 border-red-200",
          label: "Rejected",
          dotColor: "bg-red-500",
        };
      case "pending":
        return {
          icon: (
            <ClockIcon
              size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
              className="text-yellow-500"
            />
          ),
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          label: "Pending",
          dotColor: "bg-yellow-500",
        };
      case "unverified":
      default:
        return {
          icon: (
            <AlertCircleIcon
              size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
              className="text-gray-400"
            />
          ),
          color: "text-gray-600 bg-gray-50 border-gray-200",
          label: "Unverified",
          dotColor: "bg-gray-400",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center">
      {showIcon && <div className="mr-2">{config.icon}</div>}
      {showLabel && (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
        >
          {config.label}
        </span>
      )}
      {!showIcon && !showLabel && (
        <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
      )}
    </div>
  );
};

// Badge variant for compact display
export const VerificationBadge: React.FC<{
  status: "pending" | "verified" | "rejected" | "unverified";
}> = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case "verified":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircleIcon size={12} className="text-green-600" />,
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircleIcon size={12} className="text-red-600" />,
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <ClockIcon size={12} className="text-yellow-600" />,
        };
      case "unverified":
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircleIcon size={12} className="text-gray-600" />,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      <span className="ml-1">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </span>
  );
};
