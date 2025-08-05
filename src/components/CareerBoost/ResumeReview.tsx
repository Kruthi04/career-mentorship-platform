import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import {
  FileTextIcon,
  CheckIcon,
  UploadIcon,
  ArrowLeftIcon,
  ClockIcon,
  StarIcon,
  AlertCircleIcon,
  DownloadIcon,
  EyeIcon,
  UserIcon,
  BriefcaseIcon,
  LinkIcon,
} from "lucide-react";

// Define TypeScript interfaces
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

export const ResumeReview = () => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");

  const [resumeLink, setResumeLink] = useState("");

  const [uploadMethod, setUploadMethod] = useState("file"); // 'file' or 'link'

  const [industry, setIndustry] = useState("");

  const [experience, setExperience] = useState("");

  const [targetRole, setTargetRole] = useState("");

  const [priority, setPriority] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedReviewer, setSelectedReviewer] = useState<string | null>(null);

  const [feedback, setFeedback] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(false);

  // Industry categories for selection
  const industryCategories = [
    {
      id: "software_development",
      name: "Software Development",
      description: "Web, mobile, and software development roles",
      icon: "💻",
      color: "bg-blue-50 border-blue-200 text-blue-800",
    },
    {
      id: "data_science",
      name: "Data Science",
      description: "Data analysis, ML, and analytics roles",
      icon: "📊",
      color: "bg-green-50 border-green-200 text-green-800",
    },
    {
      id: "business",
      name: "Business & Management",
      description: "Business strategy, consulting, and management roles",
      icon: "💼",
      color: "bg-purple-50 border-purple-200 text-purple-800",
    },
    {
      id: "marketing",
      name: "Marketing & Sales",
      description: "Digital marketing, sales, and growth roles",
      icon: "📈",
      color: "bg-orange-50 border-orange-200 text-orange-800",
    },
    {
      id: "design",
      name: "Design & Creative",
      description: "UI/UX, graphic design, and creative roles",
      icon: "🎨",
      color: "bg-pink-50 border-pink-200 text-pink-800",
    },
    {
      id: "finance",
      name: "Finance & Accounting",
      description: "Financial analysis, accounting, and investment roles",
      icon: "💰",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    },
    {
      id: "healthcare",
      name: "Healthcare",
      description: "Medical, pharmaceutical, and healthcare technology roles",
      icon: "🏥",
      color: "bg-red-50 border-red-200 text-red-800",
    },
    {
      id: "education",
      name: "Education & Training",
      description: "Teaching, training, and educational technology roles",
      icon: "📚",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800",
    },
  ];

  // Resume review categories
  const resumeCategories = [
    {
      id: "resume_review",
      name: "Resume Review",
      description:
        "Expert feedback on resume content, structure, and ATS optimization",
      icon: "📄",
      color: "bg-blue-50 border-blue-200 text-blue-800",
    },
    {
      id: "linkedin_review",
      name: "LinkedIn Profile Review",
      description:
        "Optimize your LinkedIn profile for recruiters and networking",
      icon: "💼",
      color: "bg-green-50 border-green-200 text-green-800",
    },
    {
      id: "cover_letter",
      name: "Cover Letter Review",
      description: "Craft compelling cover letters that stand out",
      icon: "✉️",
      color: "bg-purple-50 border-purple-200 text-purple-800",
    },
    {
      id: "portfolio_review",
      name: "Portfolio Review",
      description: "Get feedback on your professional portfolio",
      icon: "🎨",
      color: "bg-orange-50 border-orange-200 text-orange-800",
    },
  ];

  // Fetch mentors for selected category
  useEffect(() => {
    const fetchMentors = async () => {
      if (selectedIndustry) {
        try {
          setLoadingMentors(true);
          // Map industry categories to help areas for mentor fetching
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
        } finally {
          setLoadingMentors(false);
        }
      }
    };
    fetchMentors();
  }, [selectedIndustry]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a preview URL for PDF if possible
      if (selectedFile.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(selectedFile);
        setFilePreview(fileUrl);
      }
    }
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
      if (uploadMethod === "file" && file) {
        const formData = new FormData();
        formData.append("resume", file);
        formData.append(
          "title",
          `Resume Review - ${new Date().toLocaleDateString()}`
        );
        formData.append(
          "description",
          `Resume uploaded for review on ${new Date().toLocaleDateString()}`
        );
        formData.append("industry", industry);
        formData.append("experience", experience);
        formData.append("targetRole", targetRole);
        formData.append("priority", priority);
        if (selectedReviewer !== null) {
          formData.append("selectedReviewer", selectedReviewer);
        }

        const response = await fetch("/api/resumes/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Resume uploaded successfully:", data);

          // Create a session for this career service
          await createSessionFromCareerService(data.resume._id);

          setSuccess(true);
          setStep(6); // Move to success step instead of resetting
        } else {
          const errorData = await response.json();
          setError(
            errorData.message || "Error uploading resume. Please try again."
          );
        }
      } else if (uploadMethod === "link" && resumeLink.trim() !== "") {
        const response = await fetch("/api/resumes/link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: `Resume Review - ${new Date().toLocaleDateString()}`,
            description: `Resume link submitted for review on ${new Date().toLocaleDateString()}`,
            resumeLink: resumeLink.trim(),
            industry,
            experience,
            targetRole,
            priority,
            selectedReviewer,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Resume link stored successfully:", data);

          // Create a session for this career service
          await createSessionFromCareerService(data.resume._id);

          setSuccess(true);
          setStep(6); // Move to success step instead of resetting
        } else {
          const errorData = await response.json();
          setError(
            errorData.message ||
              "Error submitting resume link. Please try again."
          );
        }
      } else {
        setError("Please select a file or provide a resume link.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Error submitting resume. Please try again.");
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
          sessionType: "resume_review", // Use resume_review as the default session type
          mentorId: selectedReviewer, // Include the selected mentor ID
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Session created from career service:", data);
      } else {
        console.error("Failed to create session from career service");
      }
    } catch (error) {
      console.error("Error creating session from career service:", error);
    }
  };

  const resetForm = () => {
    setFile(null);
    setResumeLink("");
    setIndustry("");
    setExperience("");
    setTargetRole("");
    setPriority("");
    setSelectedCategory("");
    setSelectedIndustry("");
    setSelectedReviewer(null);
    setUploadMethod("file");
    setFeedback(true);
    setSuccess(false);
    setError("");
    setStep(1);
    window.scrollTo(0, 0);
  };

  // Check if user has provided a resume (either file or link)
  const hasResumeProvided = () => {
    return (
      (uploadMethod === "file" && file) ||
      (uploadMethod === "link" && resumeLink.trim() !== "")
    );
  };
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-16">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1586282391129-76a6df230234?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Resume on desk"
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
              Professional Resume Review Service
            </h1>
            <p className="text-xl text-sail mb-6">
              Get expert feedback on your resume to stand out to recruiters and
              land your dream job.
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
                <span>ATS optimization</span>
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
                    Resume submitted successfully! A session has been created
                    for review.
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
            {/* Step 1: Upload Resume */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Upload Your Resume
                </h2>
                <p className="text-gray-600 mb-6">
                  Please upload your current resume or provide a link to it. We
                  accept PDF or Word documents.
                </p>

                {/* Upload method selector */}

                <div className="mb-6">
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setUploadMethod("file")}
                      className={`flex items-center px-4 py-2 rounded-md ${
                        uploadMethod === "file"
                          ? "bg-sail text-mariner border border-mariner"
                          : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      <UploadIcon size={18} className="mr-2" />
                      Upload File
                    </button>

                    <button
                      type="button"
                      onClick={() => setUploadMethod("link")}
                      className={`flex items-center px-4 py-2 rounded-md ${
                        uploadMethod === "link"
                          ? "bg-sail text-mariner border border-mariner"
                          : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      <LinkIcon size={18} className="mr-2" />
                      Provide Link
                    </button>
                  </div>
                </div>

                {uploadMethod === "file" ? (
                  <div className="mb-8">
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {filePreview ? (
                          <div className="flex flex-col items-center">
                            <FileTextIcon className="mx-auto h-12 w-12 text-mariner" />

                            <p className="text-sm text-gray-700 mt-2">
                              {file?.name}
                            </p>

                            <div className="flex mt-4 space-x-2">
                              <a
                                href={filePreview}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 text-sm text-mariner border border-mariner rounded-md hover:bg-sail flex items-center"
                              >
                                <EyeIcon size={14} className="mr-1" />
                                Preview
                              </a>

                              <button
                                onClick={() => {
                                  setFile(null);

                                  setFilePreview("");
                                }}
                                className="px-3 py-1 text-sm text-red-700 border border-red-700 rounded-md hover:bg-red-50"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />

                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-mariner hover:text-royal-blue focus-within:outline-none"
                              >
                                <span>Upload a file</span>

                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileChange}
                                />
                              </label>

                              <p className="pl-1">or drag and drop</p>
                            </div>

                            <p className="text-xs text-gray-500">
                              PDF, DOC, or DOCX up to 10MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8">
                    <label
                      htmlFor="resume-link"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Link to your resume
                    </label>

                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon size={18} className="text-gray-400" />
                      </div>

                      <input
                        type="url"
                        id="resume-link"
                        value={resumeLink}
                        onChange={(e) => setResumeLink(e.target.value)}
                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mariner focus:border-mariner"
                        placeholder="https://drive.google.com/file/your-resume"
                        required
                      />
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Please provide a link to your resume stored in Google
                      Drive, Dropbox, OneDrive, or another cloud storage
                      service. Make sure the link is accessible to anyone with
                      the link.
                    </p>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <Link
                    to="/career-boost"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </Link>

                  <button
                    onClick={nextStep}
                    disabled={!hasResumeProvided()}
                    className={`px-6 py-2 rounded-md ${
                      hasResumeProvided()
                        ? "bg-mariner text-white hover:bg-royal-blue"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Select Industry */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Select Your Industry
                </h2>
                <p className="text-gray-600 mb-8">
                  Choose the industry that best matches your career goals and
                  target role.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {industryCategories.map((industry) => (
                    <div
                      key={industry.id}
                      className={`border rounded-lg p-6 cursor-pointer transition-all ${
                        selectedIndustry === industry.id
                          ? "border-mariner bg-sail"
                          : "border-gray-200 hover:border-mariner"
                      }`}
                      onClick={() => setSelectedIndustry(industry.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{industry.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-2">
                            {industry.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {industry.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!selectedIndustry}
                    className={`px-6 py-2 rounded-md ${
                      selectedIndustry
                        ? "bg-mariner text-white hover:bg-royal-blue"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Choose Reviewer */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Choose Your{" "}
                  {
                    industryCategories.find((i) => i.id === selectedIndustry)
                      ?.name
                  }{" "}
                  Expert
                </h2>
                <p className="text-gray-600 mb-8">
                  Select the expert you'd like to review your resume. Each
                  reviewer has unique expertise and industry knowledge.
                </p>

                {/* Selected Industry Display */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">Industry:</div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {
                        industryCategories.find(
                          (i) => i.id === selectedIndustry
                        )?.icon
                      }{" "}
                      {
                        industryCategories.find(
                          (i) => i.id === selectedIndustry
                        )?.name
                      }
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {loadingMentors ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mariner mx-auto"></div>
                      <p className="mt-2 text-gray-600">
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
                        experts available for resume review at the moment.
                      </p>
                    </div>
                  ) : (
                    mentors.map((mentor: Mentor) => (
                      <div
                        key={mentor._id}
                        className={`border rounded-lg p-4 transition-all cursor-pointer ${
                          selectedReviewer === mentor._id
                            ? "border-mariner bg-sail"
                            : "border-gray-200 hover:border-mariner"
                        }`}
                        onClick={() => setSelectedReviewer(mentor._id)}
                      >
                        <div className="flex items-start">
                          <div className="w-16 h-16 rounded-full bg-sail flex items-center justify-center mr-4">
                            {mentor.profileImage ? (
                              <img
                                src={mentor.profileImage}
                                alt={mentor.fullName}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-mariner font-semibold text-lg">
                                {mentor.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-gray-800">
                                  {mentor.fullName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {mentor.professionalTitle}
                                </p>
                              </div>
                              <div className="flex items-center">
                                <StarIcon
                                  size={16}
                                  className="text-yellow-400"
                                />
                                <span className="ml-1 text-sm font-medium">
                                  {mentor.rating || 4.5}
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                  ({mentor.reviews || 0} reviews)
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">
                              {mentor.bio}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {mentor.areasOfExpertise
                                .slice(0, 3)
                                .map((specialty: string, index: number) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sail text-mariner"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              <span>
                                {mentor.yearsOfExperience}+ years experience
                              </span>
                              {mentor.offerFreeIntro && (
                                <span className="ml-2 text-green-600">
                                  • Free intro session
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!selectedReviewer}
                    className={`px-6 py-2 rounded-md ${
                      selectedReviewer
                        ? "bg-mariner text-white hover:bg-royal-blue"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Additional Information */}
            {step === 4 && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Additional Information
                </h2>
                <p className="text-gray-600 mb-8">
                  Help us provide the most relevant feedback by telling us more
                  about your career goals.
                </p>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="industry"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Industry
                    </label>
                    <select
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mariner focus:border-mariner"
                      required
                    >
                      <option value="">Select your industry</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="marketing">Marketing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Years of Experience
                    </label>
                    <select
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mariner focus:border-mariner"
                      required
                    >
                      <option value="">Select your experience level</option>
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="mid">Mid-Level (3-5 years)</option>
                      <option value="senior">Senior (6-10 years)</option>
                      <option value="executive">Executive (10+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="targetRole"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Target Role
                    </label>
                    <input
                      type="text"
                      id="targetRole"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mariner focus:border-mariner"
                      placeholder="e.g., Software Engineer, Marketing Manager"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      What's your top priority for improvement?
                    </label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mariner focus:border-mariner"
                      required
                    >
                      <option value="">Select your top priority</option>
                      <option value="ats">ATS Optimization</option>
                      <option value="content">Content & Achievements</option>
                      <option value="format">Formatting & Design</option>
                      <option value="targeting">Job Targeting</option>
                      <option value="all">Overall Assessment</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={
                      !industry ||
                      !experience ||
                      !targetRole ||
                      !priority ||
                      !hasResumeProvided()
                    }
                    className={`px-6 py-2 rounded-md ${
                      industry &&
                      experience &&
                      targetRole &&
                      priority &&
                      hasResumeProvided()
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
                    Confirm Your Resume Review Submission
                  </h2>
                  <p className="text-gray-600">
                    Please review your submission details below before
                    submitting your resume for review.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Submission Summary
                  </h3>
                  <div className="space-y-3">
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
                      <span className="text-gray-600">Service Type:</span>
                      <span className="font-medium">Resume Review</span>
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
                    <div className="flex justify-between">
                      <span className="text-gray-600">Upload Method:</span>
                      <span className="font-medium capitalize">
                        {uploadMethod === "file" ? "File Upload" : "Link"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resume:</span>
                      <span className="font-medium">
                        {uploadMethod === "file" ? file?.name : resumeLink}
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
                    {submitting ? "Submitting..." : "Submit Resume Review"}
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Start Over
                  </button>
                  <Link
                    to="/dashboard"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Go to Dashboard
                  </Link>
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
                    Resume Review Submitted Successfully!
                  </h2>
                  <p className="text-gray-600">
                    Thank you for submitting your resume for review.{" "}
                    {selectedReviewer &&
                      mentors.find((m) => m._id === selectedReviewer)
                        ?.fullName}{" "}
                    will review your submission and provide detailed feedback.
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetForm}
                    className="px-6 py-2 bg-mariner text-white rounded-md hover:bg-royal-blue"
                  >
                    Submit Another Review
                  </button>
                  <Link
                    to="/dashboard"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* What's Included Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            What's Included in Our Resume Review
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sail rounded-full flex items-center justify-center mb-4">
                <AlertCircleIcon size={24} className="text-mariner" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ATS Optimization
              </h3>
              <p className="text-gray-600">
                We'll optimize your resume to pass through Applicant Tracking
                Systems and reach human recruiters.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sail rounded-full flex items-center justify-center mb-4">
                <FileTextIcon size={24} className="text-royal-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Content Enhancement
              </h3>
              <p className="text-gray-600">
                We'll improve your achievement statements to highlight your
                impact and use powerful action verbs.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sail rounded-full flex items-center justify-center mb-4">
                <EyeIcon size={24} className="text-lynch" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Visual Improvement
              </h3>
              <p className="text-gray-600">
                We'll enhance the layout, formatting, and design to create a
                professional and easy-to-read resume.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sail rounded-full flex items-center justify-center mb-4">
                <DownloadIcon size={24} className="text-mariner" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Follow-up Session
              </h3>
              <p className="text-gray-600">
                Schedule a 30-minute consultation to discuss your resume
                feedback and get answers to your questions.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Client"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-800">Michael Chen</h3>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-4">
                <StarIcon size={18} />
                <StarIcon size={18} />
                <StarIcon size={18} />
                <StarIcon size={18} />
                <StarIcon size={18} />
              </div>
              <p className="text-gray-700">
                "The resume review service was a game-changer for my job search.
                I started getting interview calls within days of updating my
                resume with their suggestions."
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Client"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-800">Sarah Johnson</h3>
                  <p className="text-sm text-gray-600">Marketing Manager</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-4">
                <StarIcon size={18} />
                <StarIcon size={18} />
                <StarIcon size={18} />
                <StarIcon size={18} />
                <StarIcon size={18} />
              </div>
              <p className="text-gray-700">
                "I was struggling to showcase my achievements effectively. The
                expert feedback helped me quantify my impact and create a resume
                that truly represents my value."
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="Client"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-800">David Wilson</h3>
                  <p className="text-sm text-gray-600">Project Manager</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-4">
                <StarIcon size={18} />
                <StarIcon size={18} />
                <StarIcon size={18} />
                <StarIcon size={18} />
                <StarIcon size={18} />
              </div>
              <p className="text-gray-700">
                "The ATS optimization tips were invaluable. After implementing
                the changes, my application success rate improved dramatically.
                Highly recommend!"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
