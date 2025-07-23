import React, { useState } from "react";
import {
  UploadIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  FileTextIcon,
  CameraIcon,
  ShieldIcon,
} from "lucide-react";

interface VerificationDocument {
  id: string;
  type: "id" | "certificate" | "resume" | "linkedin";
  name: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt: Date;
  file?: File;
  url?: string;
}

export const MentorVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "verified" | "rejected"
  >("pending");
  const [documents, setDocuments] = useState<VerificationDocument[]>([
    {
      id: "1",
      type: "id",
      name: "Government ID",
      status: "pending",
      uploadedAt: new Date(),
    },
    {
      id: "2",
      type: "certificate",
      name: "Professional Certifications",
      status: "pending",
      uploadedAt: new Date(),
    },
    {
      id: "3",
      type: "resume",
      name: "Current Resume",
      status: "pending",
      uploadedAt: new Date(),
    },
    {
      id: "4",
      type: "linkedin",
      name: "LinkedIn Profile",
      status: "pending",
      uploadedAt: new Date(),
    },
  ]);

  const [activeTab, setActiveTab] = useState<
    "upload" | "status" | "requirements"
  >("upload");

  const handleFileUpload = (documentId: string, file: File) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, file, status: "pending" as const }
          : doc
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon size={20} className="text-green-500" />;
      case "rejected":
        return <XCircleIcon size={20} className="text-red-500" />;
      case "pending":
        return <ClockIcon size={20} className="text-yellow-500" />;
      default:
        return <AlertCircleIcon size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Mentor Verification
                </h1>
                <p className="text-gray-600">
                  Complete your verification to start mentoring on our platform
                </p>
              </div>
              <div className="flex items-center">
                <ShieldIcon size={24} className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-600">
                  Security Verified
                </span>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Verification Status
              </h2>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  verificationStatus
                )}`}
              >
                {verificationStatus.charAt(0).toUpperCase() +
                  verificationStatus.slice(1)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileTextIcon size={24} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Documents</h3>
                <p className="text-sm text-gray-600">
                  {documents.filter((d) => d.status === "approved").length} of{" "}
                  {documents.length} approved
                </p>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircleIcon size={24} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">
                  Background Check
                </h3>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ClockIcon size={24} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Review Time</h3>
                <p className="text-sm text-gray-600">2-3 business days</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "upload"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Upload Documents
                </button>
                <button
                  onClick={() => setActiveTab("status")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "status"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Verification Status
                </button>
                <button
                  onClick={() => setActiveTab("requirements")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "requirements"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Requirements
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Upload Documents Tab */}
              {activeTab === "upload" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {documents.map((document) => (
                      <div
                        key={document.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {getStatusIcon(document.status)}
                            <span className="ml-2 font-medium text-gray-800">
                              {document.name}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              document.status
                            )}`}
                          >
                            {document.status.charAt(0).toUpperCase() +
                              document.status.slice(1)}
                          </span>
                        </div>

                        {document.file ? (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center">
                              <FileTextIcon
                                size={16}
                                className="text-gray-400 mr-2"
                              />
                              <span className="text-sm text-gray-600">
                                {document.file.name}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                handleFileUpload(document.id, null)
                              }
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <UploadIcon
                              size={24}
                              className="text-gray-400 mx-auto mb-2"
                            />
                            <p className="text-sm text-gray-600 mb-2">
                              Upload {document.name}
                            </p>
                            <input
                              type="file"
                              id={`file-${document.id}`}
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(document.id, file);
                              }}
                            />
                            <label
                              htmlFor={`file-${document.id}`}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                            >
                              Choose File
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Submit for Review
                    </button>
                  </div>
                </div>
              )}

              {/* Verification Status Tab */}
              {activeTab === "status" && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircleIcon
                        size={20}
                        className="text-blue-600 mr-3 mt-0.5"
                      />
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-1">
                          Verification in Progress
                        </h3>
                        <p className="text-blue-700 text-sm">
                          Our team is reviewing your submitted documents. You'll
                          receive an email notification once the verification is
                          complete.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {documents.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center">
                          {getStatusIcon(document.status)}
                          <div className="ml-3">
                            <h4 className="font-medium text-gray-800">
                              {document.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Submitted on{" "}
                              {document.uploadedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            document.status
                          )}`}
                        >
                          {document.status.charAt(0).toUpperCase() +
                            document.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements Tab */}
              {activeTab === "requirements" && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Verification Requirements
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <CheckCircleIcon
                          size={20}
                          className="text-green-500 mr-3 mt-0.5"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Government ID
                          </h4>
                          <p className="text-sm text-gray-600">
                            Valid government-issued photo ID (passport, driver's
                            license, or national ID)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <CheckCircleIcon
                          size={20}
                          className="text-green-500 mr-3 mt-0.5"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Professional Certifications
                          </h4>
                          <p className="text-sm text-gray-600">
                            Relevant professional certifications, degrees, or
                            licenses
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <CheckCircleIcon
                          size={20}
                          className="text-green-500 mr-3 mt-0.5"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">
                            Current Resume
                          </h4>
                          <p className="text-sm text-gray-600">
                            Updated resume showing your professional experience
                            and achievements
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <CheckCircleIcon
                          size={20}
                          className="text-green-500 mr-3 mt-0.5"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">
                            LinkedIn Profile
                          </h4>
                          <p className="text-sm text-gray-600">
                            Professional LinkedIn profile with verified work
                            experience
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircleIcon
                        size={20}
                        className="text-yellow-600 mr-3 mt-0.5"
                      />
                      <div>
                        <h3 className="font-semibold text-yellow-800 mb-1">
                          Important Notes
                        </h3>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>• All documents must be clear and legible</li>
                          <li>• File size limit: 10MB per document</li>
                          <li>• Accepted formats: PDF, JPG, PNG, DOC, DOCX</li>
                          <li>
                            • Verification process takes 2-3 business days
                          </li>
                          <li>
                            • You'll be notified via email once verification is
                            complete
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
