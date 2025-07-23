import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from "lucide-react";

export const MentorApplication = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 4;

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
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
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [existingUser, setExistingUser] = useState(null);

  // Check if user is logged in and pre-fill form data
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (user && token) {
      try {
        const userData = JSON.parse(user);
        setExistingUser(userData);
        setIsLoggedIn(true);

        // Pre-fill form with existing user data
        setFormData((prev) => ({
          ...prev,
          fullName: userData.name || "",
          email: userData.email || "",
          // Don't pre-fill password fields for security
          password: "",
          confirmPassword: "",
        }));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateFormData("idVerification", file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.professionalTitle ||
      !formData.location ||
      !formData.bio ||
      !formData.linkedInUrl
    ) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // For new users, validate email and password
    if (!isLoggedIn) {
      if (!formData.email || !formData.password) {
        setError("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
      }

      // Validate password confirmation
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setIsSubmitting(false);
        return;
      }

      // Validate password strength
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setIsSubmitting(false);
        return;
      }
    }

    // Validate ID verification is uploaded
    if (!formData.idVerification) {
      setError(
        "ID verification document is required. Please upload a government ID or passport."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("professionalTitle", formData.professionalTitle);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append(
        "areasOfExpertise",
        formData.areasOfExpertise.join(",")
      );
      formDataToSend.append("skills", formData.skills);
      formDataToSend.append("yearsOfExperience", formData.yearsOfExperience);
      formDataToSend.append(
        "languagesSpoken",
        formData.languagesSpoken.join(",")
      );
      formDataToSend.append("linkedInUrl", formData.linkedInUrl);
      formDataToSend.append("personalWebsite", formData.personalWebsite || "");
      formDataToSend.append("hourlyRate", formData.hourlyRate);
      formDataToSend.append("offerFreeIntro", formData.offerFreeIntro);
      formDataToSend.append("sessionDuration", formData.sessionDuration);
      formDataToSend.append("availability", formData.availability.join(","));

      // Add email and password only for new users
      if (!isLoggedIn) {
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
      } else {
        // For existing users, include their user ID
        formDataToSend.append("existingUserId", existingUser.id);
      }

      // Add file if uploaded
      if (formData.idVerification) {
        formDataToSend.append("idVerification", formData.idVerification);
      }

      const response = await fetch("/api/mentors/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      } else {
        setError(data.message || "Failed to submit application");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link
              to="/mentor-connect"
              className="flex items-center text-blue-600 hover:underline"
            >
              <ArrowLeftIcon size={16} className="mr-2" />
              Back to MentorConnect
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Become a Mentor
              </h1>
              {isLoggedIn && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Welcome back, {existingUser?.name}!
                      </p>
                      <p className="text-sm text-green-600">
                        We've pre-filled your information from your existing
                        account.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Step {step} of {totalSteps}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {Math.round((step / totalSteps) * 100)}% Complete
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Step 1: Basic Details */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Basic Details
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Let's start with some basic information about you.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          updateFormData("fullName", e.target.value)
                        }
                        className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isLoggedIn
                            ? "border-gray-200 bg-gray-50 text-gray-600"
                            : "border-gray-300"
                        }`}
                        placeholder="John Doe"
                        required
                        readOnly={isLoggedIn}
                      />
                      {isLoggedIn && (
                        <p className="text-xs text-gray-500 mt-1">
                          Pre-filled from your account
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Professional Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        value={formData.professionalTitle}
                        onChange={(e) =>
                          updateFormData("professionalTitle", e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Senior Software Engineer at Google"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          updateFormData("location", e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="San Francisco, CA"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Bio (Tell us about yourself)
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => updateFormData("bio", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Share your professional background, achievements, and why you want to be a mentor..."
                        required
                      ></textarea>
                    </div>
                    {!isLoggedIn && (
                      <>
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) =>
                              updateFormData("email", e.target.value)
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) =>
                              updateFormData("password", e.target.value)
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Create a password"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Confirm Password{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              updateFormData("confirmPassword", e.target.value)
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirm your password"
                            required
                          />
                        </div>
                      </>
                    )}
                    {isLoggedIn && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <div className="flex items-center">
                          <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              Using your existing account
                            </p>
                            <p className="text-sm text-blue-600">
                              Email: {existingUser?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Expertise */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Your Expertise
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Tell us about your skills and expertise areas.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="expertiseAreas"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Areas of Expertise
                      </label>
                      <select
                        id="expertiseAreas"
                        multiple
                        value={formData.areasOfExpertise}
                        onChange={(e) => {
                          const selectedOptions = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          );
                          updateFormData("areasOfExpertise", selectedOptions);
                        }}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="software-development">
                          Software Development
                        </option>
                        <option value="data-science">Data Science</option>
                        <option value="product-management">
                          Product Management
                        </option>
                        <option value="ux-design">UX Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="business">Business</option>
                      </select>
                      <p className="text-sm text-gray-500 mt-1">
                        Hold Ctrl (or Cmd) to select multiple options
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="skills"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Skills (comma separated)
                      </label>
                      <input
                        type="text"
                        id="skills"
                        value={formData.skills}
                        onChange={(e) =>
                          updateFormData("skills", e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="React, JavaScript, System Design, Leadership"
                        required
                      />
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
                        value={formData.yearsOfExperience}
                        onChange={(e) =>
                          updateFormData("yearsOfExperience", e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select years of experience</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="languages"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Languages Spoken
                      </label>
                      <select
                        id="languages"
                        multiple
                        value={formData.languagesSpoken}
                        onChange={(e) => {
                          const selectedOptions = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          );
                          updateFormData("languagesSpoken", selectedOptions);
                        }}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                        <option value="hindi">Hindi</option>
                        <option value="other">Other</option>
                      </select>
                      <p className="text-sm text-gray-500 mt-1">
                        Hold Ctrl (or Cmd) to select multiple options
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Verification */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Verification
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Help us verify your identity and professional background.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="linkedin"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        id="linkedin"
                        value={formData.linkedInUrl}
                        onChange={(e) =>
                          updateFormData("linkedInUrl", e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/in/username"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="website"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Personal Website/Portfolio (Optional)
                      </label>
                      <input
                        type="url"
                        id="website"
                        value={formData.personalWebsite}
                        onChange={(e) =>
                          updateFormData("personalWebsite", e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Verification <span className="text-red-500">*</span>
                      </label>
                      <p className="text-sm text-gray-500 mb-2">
                        Upload a government-issued ID (passport, driver's
                        license, or national ID) for verification.
                      </p>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileUpload}
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, PDF up to 10MB
                          </p>
                          {formData.idVerification && (
                            <p className="text-sm text-green-600">
                              ✓ {formData.idVerification.name} uploaded
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Terms and Conditions
                      </label>
                      <div className="flex items-start">
                        <input
                          id="terms"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                          required
                        />
                        <label
                          htmlFor="terms"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          I confirm that all information provided is accurate
                          and I agree to the{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Mentor Terms of Service
                          </a>
                          .
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Mentorship Details */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Mentorship Details
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Set up your mentorship preferences and availability.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="rate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Hourly Rate (USD)
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          id="rate"
                          value={formData.hourlyRate}
                          onChange={(e) =>
                            updateFormData("hourlyRate", e.target.value)
                          }
                          className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0 for free sessions"
                          min="0"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">
                            /hour
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Leave as 0 if you're offering free sessions
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="freeSession"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Offer Free Introduction Session?
                      </label>
                      <select
                        id="freeSession"
                        value={formData.offerFreeIntro}
                        onChange={(e) =>
                          updateFormData("offerFreeIntro", e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="yes">
                          Yes, I'll offer a free intro session
                        </option>
                        <option value="no">
                          No, all sessions will be paid
                        </option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="sessionDuration"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Session Duration
                      </label>
                      <select
                        id="sessionDuration"
                        value={formData.sessionDuration}
                        onChange={(e) =>
                          updateFormData("sessionDuration", e.target.value)
                        }
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select session duration</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">60 minutes</option>
                        <option value="90">90 minutes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <p className="text-sm text-gray-500 mb-2">
                        Select all time slots when you're available for
                        mentoring
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "weekday-mornings", label: "Weekday Mornings" },
                          {
                            id: "weekday-afternoons",
                            label: "Weekday Afternoons",
                          },
                          { id: "weekday-evenings", label: "Weekday Evenings" },
                          { id: "weekend-mornings", label: "Weekend Mornings" },
                          {
                            id: "weekend-afternoons",
                            label: "Weekend Afternoons",
                          },
                          { id: "weekend-evenings", label: "Weekend Evenings" },
                        ].map((slot) => (
                          <div key={slot.id} className="flex items-start">
                            <input
                              id={slot.id}
                              type="checkbox"
                              checked={formData.availability.includes(slot.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateFormData("availability", [
                                    ...formData.availability,
                                    slot.id,
                                  ]);
                                } else {
                                  updateFormData(
                                    "availability",
                                    formData.availability.filter(
                                      (item) => item !== slot.id
                                    )
                                  );
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                            />
                            <label
                              htmlFor={slot.id}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {slot.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Success */}
              {step > totalSteps && (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Application Submitted!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for applying to be a mentor. We'll review your
                    application and get back to you within 2-3 business days.
                  </p>
                  <Link
                    to="/mentor-connect"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Return to MentorConnect
                  </Link>
                </div>
              )}

              {/* Navigation Buttons */}
              {step <= totalSteps && (
                <div className="mt-8 flex justify-between">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ArrowLeftIcon size={16} className="mr-2" />
                      Previous
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Next
                      <ArrowRightIcon size={16} className="ml-2" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || !formData.idVerification}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                        isSubmitting || !formData.idVerification
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "text-white bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : !formData.idVerification
                        ? "Upload ID to Submit"
                        : "Submit Application"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
