import React from "react";
import { CheckCircleIcon, ClockIcon, MailIcon } from "lucide-react";

export const MentorPending = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon size={32} className="text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Mentor Application Pending
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for applying to become a mentor! We're reviewing your
              application.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <CheckCircleIcon size={24} className="text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Application Received
                </h3>
              </div>
              <p className="text-gray-600">
                Your mentor application has been successfully submitted and is
                currently under review.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MailIcon size={24} className="text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Email Verification
                </h3>
              </div>
              <p className="text-gray-600">
                Please check your email and click the verification link to
                complete your application.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              What happens next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center mr-3 mt-0.5 text-white text-sm font-medium">
                  1
                </span>
                <p className="text-yellow-700">
                  Verify your email address by clicking the link sent to your
                  inbox
                </p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center mr-3 mt-0.5 text-white text-sm font-medium">
                  2
                </span>
                <p className="text-yellow-700">
                  Our team will review your application and LinkedIn profile
                </p>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center mr-3 mt-0.5 text-white text-sm font-medium">
                  3
                </span>
                <p className="text-yellow-700">
                  You'll receive an email notification once your application is
                  approved
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Check Application Status
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Didn't receive the verification email? Check your spam folder or{" "}
              <button className="text-blue-600 hover:text-blue-700 underline">
                contact support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
