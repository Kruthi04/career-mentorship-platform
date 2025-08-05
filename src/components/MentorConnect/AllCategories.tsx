import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  UserIcon,
  CodeIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  PenToolIcon,
  LayoutIcon,
  GlobeIcon,
  ShieldIcon,
  DatabaseIcon,
  ServerIcon,
  SmartphoneIcon,
  HeadphonesIcon,
  CameraIcon,
  CloudIcon,
  BellIcon,
  AwardIcon,
  PlusIcon,
  BookIcon,
  DollarSignIcon,
  BarChart3Icon,
  StarIcon,
  CalendarIcon,
  XIcon,
  ClockIcon,
  CheckCircleIcon,
} from "lucide-react";
export const AllCategories = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState<"session" | "datetime">(
    "session"
  );
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Get category from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(parseInt(categoryParam));
    }
  }, [searchParams]);

  // Function to get skills for each category
  const getCategorySkills = (categoryId: number) => {
    const skillsMap: Record<number, string[]> = {
      1: ["React", "JavaScript"],
      2: ["Python", "Machine Learning"],
      3: ["Strategy", "Leadership"],
      4: ["SEO", "Digital Marketing"],
      5: ["UI/UX", "Figma"],
      6: ["Product Strategy", "Agile"],
      7: ["Docker", "AWS"],
      8: ["iOS", "Android"],
      9: ["Security", "Penetration Testing"],
      10: ["TensorFlow", "NLP"],
      11: ["AWS", "Azure"],
      12: ["Customer Service", "CRM"],
      13: ["Content Writing", "Video"],
      14: ["Startup", "Funding"],
      15: ["Teaching", "Curriculum"],
      16: ["Investment", "Financial Planning"],
      17: ["Global Markets", "Cross-cultural"],
      18: ["Project Planning", "Team Leadership"],
    };
    return skillsMap[categoryId] || ["Skill 1", "Skill 2"];
  };

  // Function to categorize mentors based on their skills
  const categorizeMentor = (mentor: any) => {
    const skills = [
      ...(mentor.areasOfExpertise || []),
      ...(mentor.skills || []),
    ];
    const skillsLower = skills.map((skill) => skill.toLowerCase());

    // Software Development skills
    const softwareDevSkills = [
      "javascript",
      "react",
      "node.js",
      "python",
      "java",
      "typescript",
      "angular",
      "vue",
      "php",
      "ruby",
      "go",
      "rust",
      "c++",
      "c#",
      ".net",
    ];

    // Data Science skills
    const dataScienceSkills = [
      "python",
      "machine learning",
      "data science",
      "statistics",
      "r",
      "tensorflow",
      "pytorch",
      "scikit-learn",
      "pandas",
      "numpy",
      "matplotlib",
      "seaborn",
      "jupyter",
      "sql",
      "spark",
      "hadoop",
    ];

    // Business skills
    const businessSkills = [
      "strategy",
      "management",
      "leadership",
      "project management",
      "business development",
      "sales",
      "marketing",
      "finance",
      "accounting",
      "operations",
      "supply chain",
      "logistics",
      "human resources",
      "hr",
      "recruiting",
      "consulting",
      "entrepreneurship",
      "startup",
    ];

    // Marketing skills
    const marketingSkills = [
      "digital marketing",
      "social media",
      "content marketing",
      "seo",
      "sem",
      "ppc",
      "google ads",
      "facebook ads",
      "email marketing",
      "growth hacking",
      "conversion optimization",
      "analytics",
    ];

    // Design skills
    const designSkills = [
      "ui design",
      "ux design",
      "user interface",
      "user experience",
      "figma",
      "sketch",
      "adobe xd",
      "invision",
      "framer",
      "photoshop",
      "illustrator",
      "indesign",
      "prototyping",
      "wireframing",
    ];

    // Product Management skills
    const productManagementSkills = [
      "product strategy",
      "roadmapping",
      "product vision",
      "user stories",
      "requirements gathering",
      "feature prioritization",
      "backlog management",
      "agile",
      "scrum",
      "kanban",
      "sprint planning",
      "retrospectives",
    ];

    // Check which category the mentor belongs to
    if (skillsLower.some((skill) => softwareDevSkills.includes(skill))) {
      return 1; // Software Development
    } else if (skillsLower.some((skill) => dataScienceSkills.includes(skill))) {
      return 2; // Data Science
    } else if (skillsLower.some((skill) => businessSkills.includes(skill))) {
      return 3; // Business
    } else if (skillsLower.some((skill) => marketingSkills.includes(skill))) {
      return 4; // Marketing
    } else if (skillsLower.some((skill) => designSkills.includes(skill))) {
      return 5; // Design
    } else if (
      skillsLower.some((skill) => productManagementSkills.includes(skill))
    ) {
      return 6; // Product Management
    }

    return null; // No specific category
  };

  // Fetch mentors from backend
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/mentors/verified");
        if (!response.ok) {
          throw new Error("Failed to fetch mentors");
        }
        const data = await response.json();
        setMentors(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching mentors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const categories = [
    {
      id: 1,
      name: "Software Development",
      count: mentors.filter((mentor) => categorizeMentor(mentor) === 1).length,
      color: "bg-mariner",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Learn backend & frontend technologies",
      icon: "&lt;/&gt;",
    },
    {
      id: 2,
      name: "Data Science",
      count: mentors.filter((mentor) => categorizeMentor(mentor) === 2).length,
      color: "bg-royal-blue",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Master analytics & machine learning",
      icon: "📊",
    },
    {
      id: 3,
      name: "Business",
      count: mentors.filter((mentor) => categorizeMentor(mentor) === 3).length,
      color: "bg-lynch",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Strategy, management & leadership",
      icon: "💼",
    },
    {
      id: 4,
      name: "Marketing",
      count: mentors.filter((mentor) => categorizeMentor(mentor) === 4).length,
      color: "bg-mariner",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Growth, SEO & content strategy",
      icon: "📈",
    },
    {
      id: 5,
      name: "Design",
      count: mentors.filter((mentor) => categorizeMentor(mentor) === 5).length,
      color: "bg-royal-blue",
      textColor: "text-white",
      iconColor: "text-white",
      description: "UX/UI & product design",
      icon: "🎨",
    },
    {
      id: 6,
      name: "Product Management",
      count: mentors.filter((mentor) => categorizeMentor(mentor) === 6).length,
      color: "bg-lynch",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Product strategy & roadmapping",
      icon: "📋",
    },
    {
      id: 7,
      name: "DevOps",
      count: 28,
      color: "bg-teal-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "CI/CD, cloud infrastructure & automation",
      icon: "⚙️",
    },
    {
      id: 8,
      name: "Mobile Development",
      count: 35,
      color: "bg-orange-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "iOS, Android & cross-platform apps",
      icon: "📱",
    },
    {
      id: 9,
      name: "Cybersecurity",
      count: 22,
      color: "bg-red-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Security, penetration testing & compliance",
      icon: "🔒",
    },
    {
      id: 10,
      name: "AI & Machine Learning",
      count: 31,
      color: "bg-purple-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Deep learning, NLP & computer vision",
      icon: "🤖",
    },
    {
      id: 11,
      name: "Cloud Computing",
      count: 26,
      color: "bg-blue-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "AWS, Azure, GCP & cloud architecture",
      icon: "☁️",
    },
    {
      id: 12,
      name: "Customer Success",
      count: 19,
      color: "bg-green-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Customer support, success & experience",
      icon: "🎯",
    },
    {
      id: 13,
      name: "Content Creation",
      count: 24,
      color: "bg-pink-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Writing, video & multimedia content",
      icon: "✍️",
    },
    {
      id: 14,
      name: "Entrepreneurship",
      count: 18,
      color: "bg-indigo-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Startup strategy, funding & growth",
      icon: "🚀",
    },
    {
      id: 15,
      name: "Education",
      count: 21,
      color: "bg-yellow-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Teaching, curriculum & learning design",
      icon: "📚",
    },
    {
      id: 16,
      name: "Finance",
      count: 16,
      color: "bg-emerald-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Investment, financial planning & analysis",
      icon: "💰",
    },
    {
      id: 17,
      name: "International Business",
      count: 14,
      color: "bg-cyan-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Global markets, trade & cross-cultural",
      icon: "🌍",
    },
    {
      id: 18,
      name: "Project Management",
      count: 32,
      color: "bg-yellow-600",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Planning, execution & team leadership",
      icon: "📅",
    },
  ];

  const getCategoryColor = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "bg-mariner";
  };

  const getCategoryIconBg = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "bg-mariner";
  };

  const getCategoryIcon = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon || "📋";
  };

  const getCategoryBadgeBg = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return `${category?.color} bg-opacity-30` || "bg-mariner bg-opacity-30";
  };

  const handleBookSession = (mentor: any) => {
    setSelectedMentor(mentor);
    setBookingStep("session");
  };

  const handleCloseModal = () => {
    setSelectedMentor(null);
    setSelectedSession(null);
    setSelectedDate("");
    setSelectedTime("");
    setBookingStep("session");
  };

  const handleSessionSelect = (session: any) => {
    setSelectedSession(session);
    setBookingStep("datetime");
  };

  const handleConfirmBooking = () => {
    // Here you would typically make an API call to book the session
    console.log("Booking confirmed:", {
      mentor: selectedMentor,
      session: selectedSession,
      date: selectedDate,
      time: selectedTime,
    });
    handleCloseModal();
  };

  // Mock session types for the mentor
  const getSessionTypes = (mentor: any) => [
    {
      type: "Career Guidance",
      duration: "30 min",
      price: "Free",
      description: "Get career advice and guidance",
    },
    {
      type: "Technical Interview Prep",
      duration: "60 min",
      price: `$${mentor.hourlyRate}`,
      description: "Prepare for technical interviews",
    },
    {
      type: "Code Review",
      duration: "45 min",
      price: `$${Math.round(mentor.hourlyRate * 0.75)}`,
      description: "Get your code reviewed by an expert",
    },
  ];

  // Mock available time slots
  const getAvailableTimeSlots = () => [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
  ];

  return (
    <div className="w-full bg-white">
      {/* Header Section */}
      {selectedCategory ? (
        <section className="relative text-white py-12 md:py-16 overflow-hidden">
          {/* Background with pattern and curved bottom */}
          <div className="absolute inset-0 z-0">
            <div
              className={`w-full h-full ${getCategoryColor(
                selectedCategory
              )} opacity-90`}
            ></div>
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: "20px 20px",
                }}
              ></div>
            </div>
            {/* <div
              className="absolute bottom-0 left-0 right-0 h-20 bg-white"
              style={{
                clipPath: "ellipse(100% 100% at 50% 0%)",
              }}
            ></div> */}
          </div>

          <div className="container relative mx-auto px-4 z-20">
            {/* Back button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  navigate("/all-categories");
                }}
                className="inline-flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2 text-white hover:bg-opacity-30 transition-all duration-200"
              >
                <ArrowLeftIcon size={16} className="mr-2" />
                Back to categories
              </button>
            </div>

            <div className="max-w-4xl">
              <div className="flex items-center mb-6">
                <div
                  className={`w-20 h-20 ${getCategoryIconBg(
                    selectedCategory
                  )} rounded-full flex items-center justify-center mr-8`}
                >
                  <span className="text-white text-3xl font-bold">
                    {getCategoryIcon(selectedCategory)}
                  </span>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </h1>
                  <p className="text-xl text-sail">
                    {
                      categories.find((c) => c.id === selectedCategory)
                        ?.description
                    }
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div
                  className={`flex items-center ${getCategoryBadgeBg(
                    selectedCategory
                  )} rounded-lg px-4 py-3`}
                >
                  <UserIcon size={20} className="mr-3 text-white" />
                  <span className="font-medium text-white">
                    {
                      mentors.filter(
                        (mentor) =>
                          categorizeMentor(mentor) === selectedCategory
                      ).length
                    }{" "}
                    mentors available
                  </span>
                </div>
                <div
                  className={`flex items-center ${getCategoryBadgeBg(
                    selectedCategory
                  )} rounded-lg px-4 py-3`}
                >
                  <StarIcon size={20} className="mr-3 text-white" />
                  <span className="font-medium text-white">
                    Expert guidance in{" "}
                    {categories
                      .find((c) => c.id === selectedCategory)
                      ?.name.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative text-white py-12 md:py-16 overflow-hidden">
          {/* Background with pattern and curved bottom */}
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-royal-blue opacity-90"></div>
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: "20px 20px",
                }}
              ></div>
            </div>
            {/* <div
              className="absolute bottom-0 left-0 right-0 h-20 bg-white"
              style={{
                clipPath: "ellipse(100% 100% at 50% 0%)",
              }}
            ></div> */}
          </div>

          <div className="container relative mx-auto px-4 z-20">
            {/* Back button */}
            <div className="mb-6">
              <Link
                to="/mentor-connect"
                className="inline-flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2 text-white hover:bg-opacity-30 transition-all duration-200"
              >
                <ArrowLeftIcon size={16} className="mr-2" />
                Back to MentorConnect
              </Link>
            </div>

            <div className="max-w-4xl">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-8">
                  <BriefcaseIcon size={32} className="text-royal-blue" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    All Categories
                  </h1>
                  <p className="text-xl text-sail">
                    Browse all mentor categories to find the perfect expert for
                    your needs
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-3">
                  <UserIcon size={20} className="mr-3 text-white" />
                  <span className="font-medium text-white">
                    {mentors.length} mentors available
                  </span>
                </div>
                <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-3">
                  <StarIcon size={20} className="mr-3 text-white" />
                  <span className="font-medium text-white">
                    Verified professionals ready to help
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search mentors..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mariner focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-2">
                  Session type:
                </label>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mariner">
                  <option>All sessions</option>
                  <option>Free intro</option>
                  <option>Paid sessions</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-2">
                  Sort by:
                </label>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mariner">
                  <option>Recommended</option>
                  <option>Rating</option>
                  <option>Price</option>
                  <option>Experience</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {selectedCategory ? (
            /* Show filtered mentors */
            <div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-mariner"></div>
                  <p className="mt-4 text-gray-600">Loading mentors...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">
                    Error loading mentors: {error}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors
                    .filter(
                      (mentor) => categorizeMentor(mentor) === selectedCategory
                    )
                    .map((mentor) => (
                      <div
                        key={mentor._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
                      >
                        <div className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {mentor.profileImage ? (
                                <img
                                  src={mentor.profileImage}
                                  alt={mentor.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <UserIcon size={24} className="text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 text-lg">
                                {mentor.fullName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {mentor.professionalTitle}
                              </p>
                              <div className="flex items-center mt-1">
                                <StarIcon
                                  size={16}
                                  className="text-yellow-400 mr-1"
                                />
                                <span className="text-sm text-gray-600">
                                  4.9 (47 reviews)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center mb-4">
                            <div className="flex items-center text-green-600 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Free Session Available
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {mentor.bio}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {mentor.areasOfExpertise
                              ?.slice(0, 3)
                              .map((skill: string, index: number) => (
                                <span
                                  key={index}
                                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                                >
                                  {skill}
                                </span>
                              ))}
                          </div>

                          {/* Session Types */}
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <BriefcaseIcon size={14} className="mr-1" />
                              Session Types
                            </h5>
                            <div className="space-y-2">
                              {getSessionTypes(mentor)
                                .slice(0, 2)
                                .map((session, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center text-xs"
                                  >
                                    <div>
                                      <span className="font-medium text-gray-800">
                                        {session.type}
                                      </span>
                                      <span className="text-gray-500 ml-1">
                                        ({session.duration})
                                      </span>
                                    </div>
                                    <span
                                      className={`font-semibold ${
                                        session.price === "Free"
                                          ? "text-green-600"
                                          : "text-gray-800"
                                      }`}
                                    >
                                      {session.price}
                                    </span>
                                  </div>
                                ))}
                              {getSessionTypes(mentor).length > 2 && (
                                <div className="text-xs text-gray-500 text-center">
                                  +{getSessionTypes(mentor).length - 2} more
                                  sessions
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              ${mentor.hourlyRate}/hr
                            </span>
                            <button
                              onClick={() => handleBookSession(mentor)}
                              className="px-4 py-2 bg-royal-blue text-white rounded-lg hover:bg-mariner transition-colors text-sm flex items-center"
                            >
                              <CalendarIcon size={16} className="mr-2" />
                              Book Session
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            /* Show all categories */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`relative rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-lg border border-gray-100 bg-[#C0D7FB] hover:border-mariner overflow-hidden`}
                  onClick={() =>
                    navigate(`/all-categories?category=${category.id}`)
                  }
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}
                      >
                        <div className="text-white">{category.icon}</div>
                      </div>
                      <span className="text-xs font-medium text-gray-500">
                        {
                          mentors.filter(
                            (mentor) => categorizeMentor(mentor) === category.id
                          ).length
                        }{" "}
                        mentors
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {category.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {getCategorySkills(category.id).map(
                          (skill: string, index: number) => (
                            <span
                              key={index}
                              className="text-xs bg-white bg-opacity-70 px-2 py-1 rounded text-gray-600"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="w-full mt-3 text-sm text-mariner hover:text-royal-blue font-medium transition-all duration-200">
                      View mentors →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal Popup */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Book a Session
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon size={24} />
                </button>
              </div>

              {/* Mentor Profile Section */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3">
                  {selectedMentor.profileImage ? (
                    <img
                      src={selectedMentor.profileImage}
                      alt={selectedMentor.fullName}
                      className="w-full h-auto rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <UserIcon size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {selectedMentor.fullName}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {selectedMentor.professionalTitle}
                  </p>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-yellow-400">
                      <StarIcon size={18} />
                      <span className="ml-1 text-gray-800 font-medium">
                        4.9
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      (47 reviews)
                    </span>
                    <span className="ml-auto bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium flex items-center">
                      <CheckCircleIcon size={14} className="mr-1" />
                      Free Session Available
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{selectedMentor.bio}</p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.areasOfExpertise
                        ?.slice(0, 5)
                        .map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Section */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Select a Date & Time
                </h4>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Type
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mariner focus:border-mariner"
                    onChange={(e) => {
                      const session = getSessionTypes(selectedMentor).find(
                        (s) => s.type === e.target.value
                      );
                      if (session) handleSessionSelect(session);
                    }}
                  >
                    <option value="">Select a session type</option>
                    {getSessionTypes(selectedMentor).map((session, index) => (
                      <option key={index} value={session.type}>
                        {session.type} ({session.duration}) - {session.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mariner focus:border-mariner"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {getAvailableTimeSlots().map((time, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition-colors ${
                          selectedTime === time
                            ? "bg-mariner text-white border-mariner hover:bg-royal-blue"
                            : ""
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-3"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={
                      !selectedSession || !selectedDate || !selectedTime
                    }
                    className="px-6 py-2 bg-[#2D2B55] text-white rounded-md hover:bg-[#7A89B8] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
