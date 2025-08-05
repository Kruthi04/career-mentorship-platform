import React, { useState } from "react";
import { CameraIcon, UserIcon } from "lucide-react";

interface ProfileImageUploadProps {
  profileImage: string | null;
  fullName: string;
  onImageUpload: (file: File) => Promise<void>;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  profileImage,
  fullName,
  onImageUpload,
  size = "md",
  className = "",
}) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please upload a smaller image.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onImageUpload(selectedFile);
      setShowImageUpload(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setShowImageUpload(false);
    setSelectedFile(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Profile Image */}
      <div className={`relative inline-block ${className}`}>
        <div
          className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center overflow-hidden`}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              className="w-full h-full object-cover"
              onLoad={() => {
                console.log("Image loaded successfully:", profileImage);
              }}
              onError={(e) => {
                console.error("Image failed to load:", profileImage);
                console.error("Full image URL:", profileImage);
                // Hide the image and show the fallback icon
                const target = e.currentTarget;
                target.style.display = "none";
                // Find the fallback icon and show it
                const fallbackIcon =
                  target.parentElement?.querySelector(".fallback-icon");
                if (fallbackIcon) {
                  fallbackIcon.classList.remove("hidden");
                }
              }}
            />
          ) : null}
          <div className={`fallback-icon ${profileImage ? "hidden" : ""}`}>
            {fullName ? (
              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold text-lg">
                {getInitials(fullName)}
              </div>
            ) : (
              <UserIcon size={32} className="text-gray-400" />
            )}
          </div>
        </div>
        <button
          onClick={() => setShowImageUpload(true)}
          className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition-colors"
          disabled={isUploading}
        >
          <CameraIcon size={iconSizes[size]} />
        </button>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload Profile Image</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please select an image file (JPEG, PNG, GIF). Maximum file size:
              5MB.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            />
            {selectedFile && (
              <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  Selected: {selectedFile.name}
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
