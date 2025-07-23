import React, { useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  DownloadIcon,
  UserIcon,
  ShieldIcon,
  AlertCircleIcon,
} from "lucide-react";

interface MentorVerificationRequest {
  id: string;
  mentorName: string;
  email: string;
  professionalTitle: string;
  submittedAt: Date;
  status: "pending" | "approved" | "rejected";
  documents: {
    id: string;
    type: string;
    name: string;
    url: string;
    status: "pending" | "approved" | "rejected";
  }[];
  reviewNotes?: string;
}

export const AdminVerification = () => {
  const [verificationRequests, setVerificationRequests] = useState<
    MentorVerificationRequest[]
  >([
    {
      id: "1",
      mentorName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      professionalTitle: "Senior Software Engineer",
      submittedAt: new Date("2024-01-15"),
      status: "pending",
      documents: [
        {
          id: "1",
          type: "id",
          name: "Government ID",
          url: "/uploads/id-verification-1752732912085-73743605.pdf",
          status: "pending",
        },
        {
          id: "2",
          type: "certificate",
          name: "Professional Certifications",
          url: "/uploads/certificates.pdf",
          status: "pending",
        },
        {
          id: "3",
          type: "resume",
          name: "Current Resume",
          url: "/uploads/resume.pdf",
          status: "pending",
        },
        {
          id: "4",
          type: "linkedin",
          name: "LinkedIn Profile",
          url: "https://linkedin.com/in/sarahjohnson",
          status: "pending",
        },
      ],
    },
    {
      id: "2",
      mentorName: "Michael Chen",
      email: "michael.chen@email.com",
      professionalTitle: "Product Manager",
      submittedAt: new Date("2024-01-14"),
      status: "approved",
      documents: [
        {
          id: "1",
          type: "id",
          name: "Government ID",
          url: "/uploads/id-verification-1752733097574-531864214.pdf",
          status: "approved",
        },
        {
          id: "2",
          type: "certificate",
          name: "Professional Certifications",
          url: "/uploads/certificates.pdf",
          status: "approved",
        },
        {
          id: "3",
          type: "resume",
          name: "Current Resume",
          url: "/uploads/resume.pdf",
          status: "approved",
        },
        {
          id: "4",
          type: "linkedin",
          name: "LinkedIn Profile",
          url: "https://linkedin.com/in/michaelchen",
          status: "approved",
        },
      ],
      reviewNotes: "All documents verified. Professional background confirmed.",
    },
  ]);

  const [selectedRequest, setSelectedRequest] =
    useState<MentorVerificationRequest | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const filteredRequests = verificationRequests.filter((request) => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  const handleApprove = (requestId: string) => {
    setVerificationRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? { ...request, status: "approved" as const }
          : request
      )
    );
  };

  const handleReject = (requestId: string, notes: string) => {
    setVerificationRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? { ...request, status: "rejected" as const, reviewNotes: notes }
          : request
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Mentor Verification Dashboard
                </h1>
                <p className="text-gray-600">
                  Review and approve mentor verification requests
                </p>
              </div>
              <div className="flex items-center">
                <ShieldIcon size={24} className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-600">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <UserIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Requests</p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {verificationRequests.length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full mr-4">
                  <ClockIcon size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {
                      verificationRequests.filter((r) => r.status === "pending")
                        .length
                    }
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <CheckCircleIcon size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {
                      verificationRequests.filter(
                        (r) => r.status === "approved"
                      ).length
                    }
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <XCircleIcon size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rejected</p>
                  <h3 className="text-xl font-bold text-gray-800">
                    {
                      verificationRequests.filter(
                        (r) => r.status === "rejected"
                      ).length
                    }
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Verification Requests
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === "pending"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter("approved")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === "approved"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setFilter("rejected")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filter === "rejected"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mentor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Professional Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={`https://randomuser.me/api/portraits/${
                                request.mentorName.includes("Sarah")
                                  ? "women"
                                  : "men"
                              }/44.jpg`}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.mentorName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.professionalTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.submittedAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <EyeIcon size={16} />
                        </button>
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              <CheckCircleIcon size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleReject(
                                  request.id,
                                  "Documents insufficient"
                                )
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircleIcon size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed View Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Verification Details - {selectedRequest.mentorName}
                  </h3>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedRequest.mentorName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedRequest.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Professional Title
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedRequest.professionalTitle}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Submitted
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedRequest.submittedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documents
                    </label>
                    <div className="space-y-2">
                      {selectedRequest.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                        >
                          <div className="flex items-center">
                            {getStatusIcon(doc.status)}
                            <span className="ml-2 text-sm font-medium text-gray-800">
                              {doc.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                doc.status
                              )}`}
                            >
                              {doc.status.charAt(0).toUpperCase() +
                                doc.status.slice(1)}
                            </span>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <DownloadIcon size={16} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedRequest.reviewNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Review Notes
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedRequest.reviewNotes}
                      </p>
                    </div>
                  )}

                  {selectedRequest.status === "pending" && (
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        onClick={() => {
                          handleApprove(selectedRequest.id);
                          setSelectedRequest(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleReject(
                            selectedRequest.id,
                            "Documents insufficient"
                          );
                          setSelectedRequest(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
