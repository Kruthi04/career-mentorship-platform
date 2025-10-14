import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  UsersIcon,
  UserCheckIcon,
  LinkedinIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  MapPinIcon,
  GlobeIcon,
  DollarSignIcon,
  CalendarIcon,
  FileTextIcon,
  ShieldIcon,
} from "lucide-react";

interface MentorFormData {
  professionalTitle: string;
  location: string;
  bio: string;
  areasOfExpertise: string[];
  skills: string;
  yearsOfExperience: string;
  languagesSpoken: string[];
  linkedInUrl: string;
  personalWebsite: string;
  hourlyRate: string;
  offerFreeIntro: string;
  sessionDuration: string;
  availability: string[];
  idVerification: File | null;
}

export const MentorSignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("mentee");
  const [wantsLinkedInVerification, setWantsLinkedInVerification] =
    useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );

  // Mentor application form fields
  const [mentorFormData, setMentorFormData] = useState<MentorFormData>({
    professionalTitle: "",
    location: "",
    bio: "",
    areasOfExpertise: [],
    skills: "",
    yearsOfExperience: "",
    languagesSpoken: [],
    linkedInUrl: "",
    personalWebsite: "",
    hourlyRate: "",
    offerFreeIntro: "yes",
    sessionDuration: "",
    availability: [],
    idVerification: null,
  });

  const updateMentorFormData = (field: keyof MentorFormData, value: any) => {
    setMentorFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file.name, file.size, file.type);
      updateMentorFormData("idVerification", file);
    }
  };

  // Initialize LinkedIn verification with OAuth
  const initiateLinkedInVerification = async (userId: string) => {
    try {
      console.log("Initiating LinkedIn verification with OAuth...");

      const response = await fetch(`/api/linkedin/auth-url/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("LinkedIn OAuth URL generated:", data);
        // Redirect user to LinkedIn OAuth
        window.location.href = data.authUrl;
        return data;
      } else {
        console.error("Error generating LinkedIn OAuth URL:", data);
        throw new Error(
          data.message || "Failed to generate LinkedIn OAuth URL"
        );
      }
    } catch (error) {
      console.error("Error initiating LinkedIn verification:", error);
      throw error;
    }
  };

  // Check LinkedIn verification status
  const checkVerificationStatus = async (userId: string) => {
    try {
      const response = await fetch(`/api/linkedin/status/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Verification status:", data);
        setVerificationStatus(data.verified ? "verified" : "not_initiated");
        return data;
      } else {
        console.error("Error checking verification status:", data);
        return null;
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    console.log("Form submitted:", {
      name,
      email,
      password: "***",
      userType,
      wantsLinkedInVerification,
    });

    // Validate basic form fields
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Validate mentor form fields if user is becoming a mentor
    if (userType === "mentor" || userType === "both") {
      if (
        !mentorFormData.professionalTitle ||
        !mentorFormData.location ||
        !mentorFormData.bio ||
        !mentorFormData.linkedInUrl ||
        !mentorFormData.idVerification
      ) {
        setError("Please fill in all required mentor fields.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (userType === "mentor" || userType === "both") {
        // Submit combined registration and mentor application
        const formDataToSend = new FormData();

        // Basic registration data
        formDataToSend.append("name", name);
        formDataToSend.append("email", email);
        formDataToSend.append("password", password);
        formDataToSend.append("userType", userType);
        formDataToSend.append(
          "wantsLinkedInVerification",
          wantsLinkedInVerification.toString()
        );

        // Mentor application data
        formDataToSend.append("fullName", name);
        formDataToSend.append(
          "professionalTitle",
          mentorFormData.professionalTitle
        );
        formDataToSend.append("location", mentorFormData.location);
        formDataToSend.append("bio", mentorFormData.bio);
        formDataToSend.append(
          "areasOfExpertise",
          mentorFormData.areasOfExpertise.join(",")
        );
        formDataToSend.append("skills", mentorFormData.skills);
        formDataToSend.append(
          "yearsOfExperience",
          mentorFormData.yearsOfExperience
        );
        formDataToSend.append(
          "languagesSpoken",
          mentorFormData.languagesSpoken.join(",")
        );
        formDataToSend.append("linkedInUrl", mentorFormData.linkedInUrl);
        formDataToSend.append(
          "personalWebsite",
          mentorFormData.personalWebsite || ""
        );
        formDataToSend.append("hourlyRate", mentorFormData.hourlyRate);
        formDataToSend.append("offerFreeIntro", mentorFormData.offerFreeIntro);
        formDataToSend.append(
          "sessionDuration",
          mentorFormData.sessionDuration
        );
        formDataToSend.append(
          "availability",
          mentorFormData.availability.join(",")
        );

        // Add ID verification file
        if (mentorFormData.idVerification) {
          formDataToSend.append(
            "idVerification",
            mentorFormData.idVerification
          );
        }

        const res = await fetch("/api/mentors/register", {
          method: "POST",
          body: formDataToSend,
        });

        const data = await res.json();

        if (res.ok) {
          console.log("Registration successful:", data);

          // If user wants LinkedIn verification, initiate OAuth verification
          if (wantsLinkedInVerification && data.userId) {
            try {
              await initiateLinkedInVerification(data.userId);
              // User will be redirected to LinkedIn OAuth, so no need to navigate here
            } catch (verificationError) {
              console.error("LinkedIn verification error:", verificationError);
              alert(
                "Registration successful! However, LinkedIn verification could not be initiated. You can verify your LinkedIn profile later from your dashboard."
              );
              navigate("/mentor-signin");
            }
          } else {
            // Navigate to sign-in page
            navigate("/mentor-signin");
          }
        } else {
          setError(data.message || "Registration failed");
        }
      } else {
        // Regular mentee registration
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            userType,
            wantsLinkedInVerification,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          console.log("Registration successful:", data);
          navigate("/mentor-signin");
        } else {
          setError(data.message || "Registration failed");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Join MentorConnect
          </h2>
          <p className="text-gray-600 text-lg">
            Connect with mentors and accelerate your career growth
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* User Type Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                I want to...
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    name="userType"
                    value="mentee"
                    checked={userType === "mentee"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      userType === "mentee"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <UsersIcon className="h-6 w-6 text-blue-600 mr-2" />
                      <span className="font-semibold text-gray-900">
                        Find a Mentor
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Connect with experienced professionals to guide your
                      career
                    </p>
                  </div>
                </label>

                <label className="relative">
                  <input
                    type="radio"
                    name="userType"
                    value="mentor"
                    checked={userType === "mentor"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      userType === "mentor"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <UserCheckIcon className="h-6 w-6 text-blue-600 mr-2" />
                      <span className="font-semibold text-gray-900">
                        Become a Mentor
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Share your expertise and help others grow professionally
                    </p>
                  </div>
                </label>

                <label className="relative">
                  <input
                    type="radio"
                    name="userType"
                    value="both"
                    checked={userType === "both"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      userType === "both"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <UserIcon className="h-6 w-6 text-blue-600 mr-2" />
                      <span className="font-semibold text-gray-900">Both</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Find mentors and become a mentor yourself
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Create a strong password"
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

            {/* LinkedIn Verification Option */}
            {(userType === "mentor" || userType === "both") && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <ShieldIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      LinkedIn Verification
                    </h3>
                    <p className="text-sm text-blue-800 mb-3">
                      Verify your LinkedIn profile to build trust with mentees.
                      We'll securely verify your professional information using
                      Phyllo.
                    </p>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={wantsLinkedInVerification}
                        onChange={(e) =>
                          setWantsLinkedInVerification(e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-blue-800">
                        Yes, I want to verify my LinkedIn profile
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Mentor Application Form */}
            {(userType === "mentor" || userType === "both") && (
              <div className="border-t pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Mentor Application
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Title *
                    </label>
                    <div className="relative">
                      <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={mentorFormData.professionalTitle}
                        onChange={(e) =>
                          updateMentorFormData(
                            "professionalTitle",
                            e.target.value
                          )
                        }
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Senior Software Engineer"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={mentorFormData.location}
                        onChange={(e) =>
                          updateMentorFormData("location", e.target.value)
                        }
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., San Francisco, CA"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio *
                  </label>
                  <textarea
                    value={mentorFormData.bio}
                    onChange={(e) =>
                      updateMentorFormData("bio", e.target.value)
                    }
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Tell us about your professional background and expertise..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Areas of Expertise *
                    </label>
                    <select
                      value={mentorFormData.areasOfExpertise[0] || ""}
                      onChange={(e) =>
                        updateMentorFormData("areasOfExpertise", [
                          e.target.value,
                        ])
                      }
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">
                        Select your primary expertise area
                      </option>
                      <option value="Software Development">
                        Software Development
                      </option>
                      <option value="Data Science">Data Science</option>
                      <option value="Business">Business</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Career Development">
                        Career Development
                      </option>
                      <option value="Leadership">Leadership</option>
                      <option value="Sales">Sales</option>
                      <option value="Operations">Operations</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Legal">Legal</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Non-Profit">Non-Profit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Language *
                    </label>
                    <select
                      value={mentorFormData.languagesSpoken[0] || ""}
                      onChange={(e) =>
                        updateMentorFormData("languagesSpoken", [
                          e.target.value,
                        ])
                      }
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select your primary language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Arabic">Arabic</option>
                      <option value="Portuguese">Portuguese</option>
                      <option value="Russian">Russian</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Korean">Korean</option>
                      <option value="Italian">Italian</option>
                      <option value="Dutch">Dutch</option>
                      <option value="Swedish">Swedish</option>
                      <option value="Norwegian">Norwegian</option>
                      <option value="Danish">Danish</option>
                      <option value="Finnish">Finnish</option>
                      <option value="Polish">Polish</option>
                      <option value="Turkish">Turkish</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <select
                      value={mentorFormData.yearsOfExperience}
                      onChange={(e) =>
                        updateMentorFormData(
                          "yearsOfExperience",
                          e.target.value
                        )
                      }
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select years of experience</option>
                      <option value="1-2">1-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="11-15">11-15 years</option>
                      <option value="16-20">16-20 years</option>
                      <option value="20+">20+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate (USD) *
                    </label>
                    <div className="relative">
                      <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={mentorFormData.hourlyRate}
                        onChange={(e) =>
                          updateMentorFormData("hourlyRate", e.target.value)
                        }
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 50"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn URL *
                    </label>
                    <div className="relative">
                      <LinkedinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={mentorFormData.linkedInUrl}
                        onChange={(e) =>
                          updateMentorFormData("linkedInUrl", e.target.value)
                        }
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/in/yourprofile"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Website
                    </label>
                    <div className="relative">
                      <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={mentorFormData.personalWebsite}
                        onChange={(e) =>
                          updateMentorFormData(
                            "personalWebsite",
                            e.target.value
                          )
                        }
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Duration *
                    </label>
                    <select
                      value={mentorFormData.sessionDuration}
                      onChange={(e) =>
                        updateMentorFormData("sessionDuration", e.target.value)
                      }
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select session duration</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Free Intro Session *
                    </label>
                    <select
                      value={mentorFormData.offerFreeIntro}
                      onChange={(e) =>
                        updateMentorFormData("offerFreeIntro", e.target.value)
                      }
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="yes">
                        Yes, I'll offer a free intro session
                      </option>
                      <option value="no">
                        No, I prefer paid sessions only
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability *
                  </label>
                  <textarea
                    value={mentorFormData.availability.join(", ")}
                    onChange={(e) =>
                      updateMentorFormData(
                        "availability",
                        e.target.value.split(", ")
                      )
                    }
                    className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="e.g., Weekdays 6-9 PM, Weekends 10 AM-2 PM"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Verification Document *
                  </label>
                  <div className="relative">
                    <FileTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a government-issued ID for verification (PDF, JPG,
                    PNG)
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center">
                  Create Account
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </div>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/mentor-signin"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
