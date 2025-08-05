import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  ClockIcon,
  StarIcon,
  CheckIcon,
  AlertCircleIcon,
  FileTextIcon,
  LinkedinIcon,
  UserIcon,
  BriefcaseIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react";

interface Mentor {
  _id: string;
  fullName: string;
  professionalTitle: string;
  profileImage?: string;
  bio: string;
  areasOfExpertise: string[];
  skills: string[];
  yearsOfExperience: number;
  hourlyRate: number;
  offerFreeIntro: boolean;
  sessionDuration: string;
  availability: string[];
  rating?: number;
  reviews?: number;
}

export const LinkedInFix = () => {
  const [step, setStep] = useState(1);
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState<string | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const industryCategories = [
    {
      id: "software_development",
      name: "Software Development",
      icon: "💻",
    },
    {
      id: "data_science",
      name: "Data Science",
      icon: "📊",
    },
    {
      id: "business",
      name: "Business",
      icon: "💼",
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: "📈",
    },
    {
      id: "design",
      name: "Design",
      icon: "🎨",
    },
    {
      id: "finance",
      name: "Finance",
      icon: "💰",
    },
    {
      id: "healthcare",
      name: "Healthcare",
      icon: "🏥",
    },
    {
      id: "education",
      name: "Education",
      icon: "📚",
    },
  ];

  const experienceLevels = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6+ years)" },
  ];

  const priorityOptions = [
    { value: "all", label: "All aspects" },
    { value: "content", label: "Content optimization" },
    { value: "networking", label: "Networking strategy" },
    { value: "branding", label: "Personal branding" },
  ];

  // Fetch mentors based on selected industry
  useEffect(() => {
    const fetchMentors = async () => {
      if (!selectedIndustry) return;

      try {
        const industryToHelpAreaMap: Record<string, string> = {
          software_development: "Software Development",
          data_science: "Data Science",
          business: "Business",
          marketing: "Marketing",
          design: "Design",
          finance: "Finance",
          healthcare: "Healthcare",
          education: "Education",
        };

        const helpArea = industryToHelpAreaMap[selectedIndustry];
        if (helpArea) {
          const response = await fetch(
            `/api/mentors/help-area/${encodeURIComponent(helpArea)}`
          );
          if (response.ok) {
            const data = await response.json();
            setMentors(data);
          } else {
            console.error("Failed to fetch mentors");
          }
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, [selectedIndustry]);

  const handleLinkedInUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkedInUrl(e.target.value);
  };

  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/linkedin/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: `LinkedIn Review - ${new Date().toLocaleDateString()}`,
          description: `LinkedIn profile submitted for review on ${new Date().toLocaleDateString()}`,
          linkedInUrl: linkedInUrl.trim(),
          industry,
          experience,
          targetRole,
          priority,
          selectedReviewer,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("LinkedIn profile stored successfully:", data);

        // Create a session for this career service
        await createSessionFromCareerService(data.linkedIn._id);

        setSuccess(true);
        setStep(6); // Move to success step instead of resetting
      } else {
        const errorData = await response.json();
        setError(
          errorData.message ||
            "Error submitting LinkedIn profile. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Error submitting LinkedIn profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const createSessionFromCareerService = async (careerServiceId: string) => {
    try {
      const response = await fetch("/api/sessions/from-career-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          careerServiceId,
          serviceType: "linkedin_review",
        }),
      });

      if (response.ok) {
        console.log("Session created successfully");
      } else {
        console.error("Failed to create session");
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const resetForm = () => {
    setLinkedInUrl("");
    setIndustry("");
    setExperience("");
    setTargetRole("");
    setPriority("");
    setSelectedCategory("");
    setSelectedIndustry("");
    setSelectedReviewer(null);
    setSuccess(false);
    setError("");
    setStep(1);
    window.scrollTo(0, 0);
  };

  // Check if user has provided a LinkedIn URL
  const hasLinkedInProvided = () => {
    return linkedInUrl.trim() !== "";
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="LinkedIn profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-royal-blue opacity-80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center mb-8">
            <Link
              to="/career-boost"
              className="flex items-center text-blue-200 hover:text-white"
            >
              <ArrowLeftIcon size={16} className="mr-2" />
              Back to Services
            </Link>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">
              Professional LinkedIn Profile Review
            </h1>
            <p className="text-xl text-sail mb-6">
              Get expert feedback on your LinkedIn profile to enhance your
              professional presence and networking opportunities.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <ClockIcon size={18} className="mr-2" />
                <span>48-hour turnaround</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <StarIcon size={18} className="mr-2" />
                <span>Industry experts</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <CheckIcon size={18} className="mr-2" />
                <span>Networking optimization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {step} of 6
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round((step / 6) * 100)}% Complete
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-mariner rounded-full transition-all duration-300"
                  style={{
                    width: `${(step / 6) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <CheckIcon size={20} className="text-green-400 mr-2" />
                  <p className="text-green-800">
                    LinkedIn profile submitted successfully! A session has been
                    created for review.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <AlertCircleIcon size={20} className="text-red-400 mr-2" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Step 1: LinkedIn URL */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LinkedinIcon size={32} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Share Your LinkedIn Profile
                  </h2>
                  <p className="text-gray-600">
                    Provide your LinkedIn profile URL so our experts can review
                    your professional presence.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={linkedInUrl}
                      onChange={handleLinkedInUrlChange}
                      placeholder="https://www.linkedin.com/in/your-profile"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-mariner focus:border-transparent"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Make sure your profile is public so our experts can access
                      it.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={nextStep}
                    disabled={!hasLinkedInProvided()}
                    className={`px-6 py-2 rounded-md ${
                      hasLinkedInProvided()
                        ? "bg-mariner text-white hover:bg-royal-blue"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Industry Selection */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BriefcaseIcon size={32} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Select Your Industry
                  </h2>
                  <p className="text-gray-600">
                    Choose the industry that best matches your professional
                    background.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {industryCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedIndustry(category.id);
                        setIndustry(category.name);
                      }}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        selectedIndustry === category.id
                          ? "border-mariner bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="text-sm font-medium text-gray-700">
                        {category.name}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!selectedIndustry}
                    className={`px-6 py-2 rounded-md ${
                      selectedIndustry
                        ? "bg-mariner text-white hover:bg-royal-blue"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Mentor Selection */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserIcon size={32} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Choose Your{" "}
                    {
                      industryCategories.find((i) => i.id === selectedIndustry)
                        ?.name
                    }{" "}
                    Expert
                  </h2>
                  <p className="text-gray-600">
                    Select the expert you'd like to review your LinkedIn
                    profile. Each reviewer has unique expertise and industry
                    knowledge.
                  </p>
                </div>

                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {
                      industryCategories.find((i) => i.id === selectedIndustry)
                        ?.icon
                    }{" "}
                    {
                      industryCategories.find((i) => i.id === selectedIndustry)
                        ?.name
                    }
                  </span>
                </div>

                {mentors.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      Loading{" "}
                      {
                        industryCategories.find(
                          (i) => i.id === selectedIndustry
                        )?.name
                      }{" "}
                      experts...
                    </p>
                  </div>
                ) : mentors.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      No{" "}
                      {
                        industryCategories.find(
                          (i) => i.id === selectedIndustry
                        )?.name
                      }{" "}
                      experts available for LinkedIn review at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {mentors.map((mentor) => (
                      <button
                        key={mentor._id}
                        onClick={() => setSelectedReviewer(mentor._id)}
                        className={`p-6 border-2 rounded-lg text-left transition-all ${
                          selectedReviewer === mentor._id
                            ? "border-mariner bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              {mentor.profileImage ? (
                                <img
                                  src={mentor.profileImage}
                                  alt={mentor.fullName}
                                  className="w-12 h-12 rounded-full"
                                />
                              ) : (
                                <UserIcon size={24} className="text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {mentor.fullName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {mentor.professionalTitle}
                              </p>
                              <div className="flex items-center mt-1">
                                <StarIcon
                                  size={16}
                                  className="text-yellow-400"
                                />
                                <span className="text-sm text-gray-600 ml-1">
                                  {mentor.rating || 0} ({mentor.reviews || 0}{" "}
                                  reviews)
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {mentor.areasOfExpertise.map((area) => (
                                <span
                                  key={area}
                                  className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1"
                                >
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!selectedReviewer}
                    className={`px-6 py-2 rounded-md ${
                      selectedReviewer
                        ? "bg-mariner text-white hover:bg-royal-blue"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Additional Information */}
            {step === 4 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TargetIcon size={32} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Additional Information
                  </h2>
                  <p className="text-gray-600">
                    Help our experts provide more targeted feedback for your
                    LinkedIn profile.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-mariner focus:border-transparent"
                    >
                      <option value="">Select experience level</option>
                      {experienceLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Role
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g., Senior Software Engineer, Product Manager"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-mariner focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-mariner focus:border-transparent"
                    >
                      <option value="">Select priority</option>
                      {priorityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Back
                  </button>

                  <button
                    onClick={nextStep}
                    disabled={
                      !experience ||
                      !targetRole ||
                      !priority ||
                      !hasLinkedInProvided()
                    }
                    className={`px-6 py-2 rounded-md ${
                      experience &&
                      targetRole &&
                      priority &&
                      hasLinkedInProvided()
                        ? "bg-mariner text-white hover:bg-royal-blue"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileTextIcon size={32} className="text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Confirm Your LinkedIn Review Submission
                  </h2>
                  <p className="text-gray-600">
                    Please review your submission details below before
                    submitting your LinkedIn profile for review.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Submission Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">LinkedIn URL:</span>
                      <span className="font-medium truncate max-w-xs">
                        {linkedInUrl}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium">
                        {
                          industryCategories.find(
                            (i) => i.id === selectedIndustry
                          )?.name
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience Level:</span>
                      <span className="font-medium">
                        {
                          experienceLevels.find((e) => e.value === experience)
                            ?.label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Role:</span>
                      <span className="font-medium">{targetRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className="font-medium">
                        {
                          priorityOptions.find((p) => p.value === priority)
                            ?.label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reviewer:</span>
                      <span className="font-medium">
                        {selectedReviewer &&
                          mentors.find((m) => m._id === selectedReviewer)
                            ?.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reviewer Expertise:</span>
                      <span className="font-medium">
                        {
                          industryCategories.find(
                            (i) => i.id === selectedIndustry
                          )?.name
                        }{" "}
                        Expert
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={submitForm}
                    disabled={submitting}
                    className={`px-6 py-2 rounded-md ${
                      submitting
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-mariner text-white hover:bg-royal-blue"
                    }`}
                  >
                    {submitting ? "Submitting..." : "Submit LinkedIn Review"}
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Success */}
            {step === 6 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckIcon size={32} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    LinkedIn Review Submitted Successfully!
                  </h2>
                  <p className="text-gray-600">
                    Thank you for submitting your LinkedIn profile for review.{" "}
                    {selectedReviewer &&
                      mentors.find((m) => m._id === selectedReviewer)
                        ?.fullName}{" "}
                    will review your submission and provide detailed feedback.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    What happens next?
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <CheckIcon size={16} className="mr-2" />
                      Your LinkedIn profile will be reviewed within 48 hours
                    </li>
                    <li className="flex items-center">
                      <CheckIcon size={16} className="mr-2" />
                      You'll receive detailed feedback and recommendations
                    </li>
                    <li className="flex items-center">
                      <CheckIcon size={16} className="mr-2" />A session will be
                      created for follow-up discussions
                    </li>
                    <li className="flex items-center">
                      <CheckIcon size={16} className="mr-2" />
                      Track your progress in your dashboard
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="px-6 py-2 bg-mariner text-white rounded-md hover:bg-royal-blue"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Submit Another Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
