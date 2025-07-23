import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  StarIcon,
  FilterIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  DollarSignIcon,
  MessageCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XIcon,
  CheckIcon,
  EyeIcon,
  BookOpenIcon,
  SettingsIcon,
  ShieldIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  MaximizeIcon,
  CodeIcon,
  BarChart3Icon,
  TrendingUpIcon,
  PenToolIcon,
  LayoutIcon,
  PlusIcon,
  MinusIcon,
  SendIcon,
  FileTextIcon,
  ArrowLeftIcon,
} from "lucide-react";
import console from "console";
export const MentorHome = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMentor, setActiveMentor] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotMinimized, setChatbotMinimized] = useState(false);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Refs for scroll functionality
  const categoriesRef = useRef(null);
  const mentorsRef = useRef(null);
  const howItWorksRef = useRef(null);

  // Category-specific popular skills
  const categoryPopularSkills: Record<number, string[]> = {
    1: ["JavaScript", "React", "Node.js"], // Software Development
    2: ["Python", "Machine Learning", "SQL"], // Data Science
    3: ["Strategy", "Leadership", "Management"], // Business
    4: ["Digital Marketing", "SEO", "Social Media"], // Marketing
    5: ["UI/UX Design", "Figma", "Prototyping"], // Design
    6: ["Product Strategy", "Agile", "User Research"], // Product Management
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
      "c++",
      "c#",
      "php",
      "ruby",
      "go",
      "swift",
      "kotlin",
      "typescript",
      "angular",
      "vue.js",
      "django",
      "flask",
      "express",
      "spring",
      "laravel",
      "asp.net",
      "html",
      "css",
      "sass",
      "less",
      "webpack",
      "babel",
      "git",
      "docker",
      "kubernetes",
      "aws",
      "azure",
      "gcp",
      "database",
      "sql",
      "mongodb",
      "postgresql",
      "mysql",
      "redis",
      "elasticsearch",
      "microservices",
      "api",
      "rest",
      "graphql",
      "testing",
      "tdd",
      "agile",
      "scrum",
      "devops",
      "ci/cd",
      "jenkins",
      "github actions",
    ];

    // Data Science skills
    const dataScienceSkills = [
      "python",
      "r",
      "matlab",
      "julia",
      "sql",
      "pandas",
      "numpy",
      "scikit-learn",
      "tensorflow",
      "pytorch",
      "keras",
      "spark",
      "hadoop",
      "hive",
      "pig",
      "kafka",
      "airflow",
      "jupyter",
      "tableau",
      "power bi",
      "matplotlib",
      "seaborn",
      "plotly",
      "machine learning",
      "deep learning",
      "neural networks",
      "nlp",
      "computer vision",
      "statistics",
      "probability",
      "linear algebra",
      "calculus",
      "optimization",
      "data mining",
      "data visualization",
      "etl",
      "data engineering",
      "big data",
      "hadoop",
      "spark",
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
      "venture capital",
      "vc",
      "investment",
      "mergers",
      "acquisitions",
      "m&a",
      "ipo",
      "business plan",
      "pitch deck",
      "market research",
      "competitive analysis",
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
      "email campaigns",
      "growth hacking",
      "conversion optimization",
      "analytics",
      "google analytics",
      "facebook pixel",
      "remarketing",
      "influencer marketing",
      "affiliate marketing",
      "branding",
      "public relations",
      "pr",
      "event marketing",
      "trade shows",
      "customer acquisition",
      "retention",
      "lifetime value",
      "ltv",
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
      "user research",
      "usability testing",
      "a/b testing",
      "design systems",
      "style guides",
      "brand identity",
      "logo design",
      "typography",
      "color theory",
      "visual design",
      "interaction design",
      "information architecture",
      "user flows",
      "journey mapping",
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
      "user research",
      "market research",
      "competitive analysis",
      "analytics",
      "metrics",
      "kpis",
      "a/b testing",
      "experimentation",
      "stakeholder management",
      "cross-functional",
      "technical product",
      "data-driven",
      "customer feedback",
      "user interviews",
      "surveys",
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

  // Filter mentors based on active category
  const filteredMentors = (mentors || []).filter(
    (mentor: any) => mentor.verified
  );

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

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
        // Fallback to hardcoded mentors if API fails
        setMentors([
          {
            _id: 1,
            fullName: "Sarah Johnson",
            professionalTitle: "Senior Software Engineer at Google",
            rating: 4.9,
            reviews: 47,
            isFree: true,
            areasOfExpertise: ["React", "JavaScript", "System Design"],
            profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "With over 10 years of experience in software engineering, I've worked on large-scale applications at Google and previously at Microsoft. I specialize in frontend development with React and JavaScript, and I'm passionate about system design and architecture.",
            availability: ["Mon-Fri: 6pm-9pm EST", "Sat: 10am-2pm EST"],
            sessionTypes: [
              { type: "Career Guidance", duration: "30 min", price: "Free" },
              {
                type: "Technical Interview Prep",
                duration: "60 min",
                price: "$50",
              },
              { type: "Code Review", duration: "45 min", price: "$40" },
            ],
          },
          {
            _id: 2,
            fullName: "Michael Chen",
            professionalTitle: "Product Manager at Microsoft",
            rating: 4.8,
            reviews: 32,
            isFree: false,
            areasOfExpertise: [
              "Product Strategy",
              "UX Research",
              "Roadmapping",
            ],
            profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
            bio: "Product Manager with 8+ years of experience at Microsoft and previously at Dropbox. I help product teams build user-centered products with clear roadmaps and effective execution strategies.",
            availability: ["Tue & Thu: 5pm-8pm PST", "Sun: 1pm-5pm PST"],
            sessionTypes: [
              {
                type: "Product Strategy Session",
                duration: "60 min",
                price: "$60",
              },
              {
                type: "Resume & Portfolio Review",
                duration: "45 min",
                price: "$45",
              },
              { type: "Mock PM Interview", duration: "60 min", price: "$70" },
            ],
          },
          {
            _id: 3,
            fullName: "Jessica Patel",
            professionalTitle: "Data Scientist at Netflix",
            rating: 5.0,
            reviews: 19,
            isFree: true,
            areasOfExpertise: [
              "Machine Learning",
              "Python",
              "Data Visualization",
            ],
            profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
            bio: "Data Scientist at Netflix specializing in recommendation algorithms and viewer behavior analysis. I have a PhD in Computer Science and love helping others break into the field of data science.",
            availability: ["Mon, Wed, Fri: 7pm-9pm PST", "Sat: 11am-3pm PST"],
            sessionTypes: [
              {
                type: "Data Science Introduction",
                duration: "30 min",
                price: "Free",
              },
              {
                type: "ML Project Consultation",
                duration: "60 min",
                price: "$55",
              },
              { type: "Python Tutoring", duration: "45 min", price: "$40" },
            ],
          },
          {
            _id: 4,
            fullName: "David Wilson",
            professionalTitle: "Marketing Director at Airbnb",
            rating: 4.7,
            reviews: 28,
            isFree: true,
            areasOfExpertise: ["Growth Marketing", "SEO", "Content Strategy"],
            profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
            bio: "Marketing Director at Airbnb with 12+ years of experience in growth marketing, SEO, and content strategy. Previously led marketing teams at Booking.com and TripAdvisor.",
            availability: ["Tue & Thu: 6pm-8pm EST", "Sat: 10am-1pm EST"],
            sessionTypes: [
              {
                type: "Marketing Strategy Session",
                duration: "30 min",
                price: "Free",
              },
              {
                type: "SEO Audit & Recommendations",
                duration: "60 min",
                price: "$65",
              },
              {
                type: "Content Calendar Planning",
                duration: "45 min",
                price: "$50",
              },
            ],
          },
        ]);
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
      color: "bg-blue-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Learn backend & frontend technologies",
      icon: <CodeIcon className="w-6 h-6" />,
    },
    {
      id: 2,
      name: "Data Science",
      count: mentors.filter((mentor) => categorizeMentor(mentor) === 2).length,
      color: "bg-purple-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Master analytics & machine learning",
      icon: <BarChart3Icon className="w-6 h-6" />,
    },
    {
      id: 3,
      name: "Business",
      count: mentors.filter((mentor) => categorizeMentor(mentor) === 3).length,
      color: "bg-green-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Strategy, management & leadership",
      icon: <BriefcaseIcon className="w-6 h-6" />,
    },
    {
      id: 4,
      name: "Marketing",
      count: mentors.filter((mentor) => categorizeMentor(mentor) === 4).length,
      color: "bg-red-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Growth, SEO & content strategy",
      icon: <TrendingUpIcon className="w-6 h-6" />,
    },
    {
      id: 5,
      name: "Design",
      count: mentors.filter((mentor) => categorizeMentor(mentor) === 5).length,
      color: "bg-yellow-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "UX/UI & product design",
      icon: <PenToolIcon className="w-6 h-6" />,
    },
    {
      id: 6,
      name: "Product Management",
      count: mentors.filter((mentor) => categorizeMentor(mentor) === 6).length,
      color: "bg-indigo-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Product strategy & roadmapping",
      icon: <LayoutIcon className="w-6 h-6" />,
    },
  ];
  // Scroll functions
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  // Handle category click
  const handleCategoryClick = (category) => {
    // This function is no longer needed as categories are fixed
  };
  // Handle mentor booking
  const handleBookSession = (mentor, e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMentor(mentor);
    // Scroll to the booking section if needed
    window.scrollTo({ top: e.target.offsetTop - 100, behavior: "smooth" });
  };
  // Handle become a mentor click
  const handleBecomeMentor = () => {
    if (isLoggedIn) {
      navigate("/mentor-connect/apply");
    } else {
      navigate("/mentor-connect/signin", {
        state: { wantsToBecomeMentor: true },
      });
    }
  };

  // Handle mentor action (become mentor or go to dashboard)
  const handleMentorAction = () => {
    if (isLoggedIn && user?.isMentor) {
      navigate("/mentor-connect/dashboard");
    } else if (isLoggedIn) {
      navigate("/mentor-connect/apply");
    } else {
      navigate("/mentor-connect/signin", {
        state: { wantsToBecomeMentor: true },
      });
    }
  };
  // Close booking modal
  const closeBookingModal = () => {
    setActiveMentor(null);
  };

  const getCategoryGradient = (id: number) => {
    switch (id) {
      case 1:
        return "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300";
      case 2:
        return "bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300";
      case 3:
        return "bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-300";
      case 4:
        return "bg-gradient-to-br from-rose-100 via-rose-200 to-rose-300";
      case 5:
        return "bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300";
      case 6:
        return "bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300";
      default:
        return "bg-gradient-to-br from-slate-100 to-slate-200";
    }
  };

  // Use mentors array directly for featured mentors

  return (
    <div className="w-full bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Mentor and mentee collaborating"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900 opacity-75"></div>
        </div>
        {/* Background Elements - keep these for visual interest */}

        <div className="container relative mx-auto px-4 z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find the perfect mentor to accelerate your career
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
              Connect with industry experts for personalized guidance, career
              advice, and skill development.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection(mentorsRef)}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <UserIcon size={18} className="mr-2" />
                Explore Mentors
              </button>
              <button
                onClick={() => scrollToSection(categoriesRef)}
                className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center"
              >
                <FilterIcon size={18} className="mr-2" />
                Browse Categories
              </button>
            </div>
            <div className="mt-6 flex items-center">
              <button
                onClick={handleMentorAction}
                className="text-white underline hover:text-blue-200 flex items-center"
              >
                {isLoggedIn && user?.isMentor ? (
                  <SettingsIcon size={16} className="mr-2" />
                ) : (
                  <StarIcon size={16} className="mr-2" />
                )}
                {isLoggedIn && user?.isMentor
                  ? "Go to your Dashboard"
                  : "Are you an expert? Become a mentor"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section with enhanced visuals */}
      <section id="categories" ref={categoriesRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">
              Explore Categories
            </h2>
            <Link
              to="/mentor-connect/categories"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View all categories
              <ChevronDownIcon size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`relative rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden ${getCategoryGradient(
                  category.id
                )}`}
                onClick={() => handleCategoryClick(category)}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
                      backgroundSize: "100% 100%",
                    }}
                  ></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-white bg-opacity-60 backdrop-blur-sm flex items-center justify-center border border-gray-200 border-opacity-50 shadow-sm">
                      <div className="text-gray-700">{category.icon}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-800">
                        {category.count}
                      </span>
                      <p className="text-sm text-gray-600">mentors</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {category.description}
                  </p>

                  {/* Popular Skills - Always Visible */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">
                      Popular skills:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(categoryPopularSkills[category.id] || [])
                        .slice(0, 3)
                        .map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="text-xs bg-white bg-opacity-80 backdrop-blur-sm px-2 py-1 rounded-full text-gray-700 border border-gray-200 border-opacity-50 shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* View Mentors Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/mentor-connect/categories/${category.id}`);
                    }}
                    className="w-full mt-3 text-sm text-gray-700 hover:text-gray-900 font-medium transition-all duration-200"
                  >
                    View mentors →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-left">
            <button className="text-blue-600 hover:text-blue-800 flex items-left mx-auto">
              Can't find what you're looking for? Request a category
            </button>
          </div>
        </div>
      </section>
      {/* SVG Wave Divider */}
      <div className="bg-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 80"
          className="fill-gray-50 w-full"
        >
          <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
        </svg>
      </div>
      {/* Featured Mentors Section with interactivity */}
      <section ref={mentorsRef} className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Mentors
            </h2>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Filter by:</span>
              <button className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                <FilterIcon size={16} className="mr-2" />
                All Categories
                <ChevronDownIcon size={16} className="ml-2" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading mentors...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">
                Error loading mentors: {error}
              </p>
              <p className="text-gray-600">Showing sample mentors</p>
            </div>
          ) : mentors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No verified mentors available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMentors.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 mb-4">
                    No mentors found in the selected category.
                  </p>
                </div>
              ) : (
                filteredMentors.map((mentor) => (
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
                              onError={(e) => {
                                console.error(
                                  "Profile image failed to load:",
                                  mentor.profileImage
                                );
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                          ) : null}
                          <div
                            className={`fallback-icon ${
                              mentor.profileImage ? "hidden" : ""
                            }`}
                          >
                            {mentor.fullName ? (
                              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold text-lg">
                                {mentor.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </div>
                            ) : (
                              <UserIcon size={24} className="text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {mentor.fullName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {mentor.professionalTitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mb-4">
                        <div className="flex items-center text-yellow-400 mr-2">
                          <StarIcon size={16} className="fill-current" />
                          <span className="ml-1 text-gray-800 font-medium">
                            {mentor.rating || 4.5}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          ({mentor.reviews || 0} reviews)
                        </span>
                        {mentor.offerFreeIntro && (
                          <span className="ml-auto bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium flex items-center">
                            <CheckCircleIcon size={12} className="mr-1" />
                            Free Session Available
                          </span>
                        )}
                      </div>
                      <div className="mb-5">
                        <p className="text-sm text-gray-700 font-medium mb-2">
                          Expertise:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(mentor.areasOfExpertise || []).map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleBookSession(mentor, e)}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <CalendarIcon size={16} className="mr-2" />
                        Book Session
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && mentors.length > 0 && (
            <div className="mt-10 text-center">
              <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                View More Mentors
              </button>
            </div>
          )}
        </div>
      </section>
      {/* SVG Wave Divider */}
      <div className="bg-gray-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 80"
          className="fill-white w-full"
        >
          <path d="M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,42.7C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
      </div>
      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            How MentorConnect Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <UserIcon size={32} className="text-blue-600" />
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-blue-100 -z-0"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Find a Mentor
              </h3>
              <p className="text-gray-600">
                Browse our curated list of industry experts and find the perfect
                match for your needs.
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <CalendarIcon size={32} className="text-blue-600" />
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-blue-100 -z-0"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Book a Session
              </h3>
              <p className="text-gray-600">
                Schedule a free or paid session at a time that works for both of
                you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <StarIcon size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Grow Your Career
              </h3>
              <p className="text-gray-600">
                Get personalized guidance and actionable advice to accelerate
                your professional growth.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={handleBecomeMentor}
              className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <UserIcon size={18} className="mr-2" />
              Become a Mentor
            </button>
          </div>
        </div>
      </section>
      {/* Cross-Promotion Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:mr-8">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Looking to review your resume too?
              </h3>
              <p className="text-gray-600 mb-5">
                Get expert feedback on your resume, LinkedIn profile, and job
                applications with CareerBoost.
              </p>
              <Link
                to="/career-boost"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <FileTextIcon size={18} className="mr-2" />
                Try CareerBoost
              </Link>
            </div>
            <div className="md:w-1/3">
              <img
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt="Resume review"
                className="rounded-md w-full shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Booking Modal */}
      {activeMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Book a Session
                </h2>
                <button
                  onClick={closeBookingModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon size={24} />
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3">
                  <div className="w-full h-48 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                    {activeMentor.profileImage ? (
                      <img
                        src={activeMentor.profileImage}
                        alt={activeMentor.fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Profile image failed to load:",
                            activeMentor.profileImage
                          );
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                    ) : null}
                    <div
                      className={`fallback-icon ${
                        activeMentor.profileImage ? "hidden" : ""
                      }`}
                    >
                      {activeMentor.fullName ? (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold text-2xl">
                          {activeMentor.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                      ) : (
                        <UserIcon size={48} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {activeMentor.fullName}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {activeMentor.professionalTitle}
                  </p>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-yellow-400">
                      <StarIcon size={18} />
                      <span className="ml-1 text-gray-800 font-medium">
                        {activeMentor.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({activeMentor.reviews} reviews)
                    </span>
                    {activeMentor.isFree && (
                      <span className="ml-auto bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium flex items-center">
                        <CheckCircleIcon size={14} className="mr-1" />
                        Free Session Available
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{activeMentor.bio}</p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeMentor.areasOfExpertise.map((skill, index) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <ClockIcon size={18} className="mr-2 text-blue-600" />
                    Availability
                  </h4>
                  <ul className="space-y-2">
                    {activeMentor.availability.map((slot, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-700"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {slot}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <BriefcaseIcon size={18} className="mr-2 text-blue-600" />
                    Session Types
                  </h4>
                  <ul className="space-y-3">
                    {activeMentor.sessionTypes.map((session, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 rounded-md bg-gray-50 border border-gray-100"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {session.type}
                          </p>
                          <p className="text-sm text-gray-600">
                            {session.duration}
                          </p>
                        </div>
                        <div
                          className={`font-medium ${
                            session.price === "Free"
                              ? "text-green-600"
                              : "text-gray-800"
                          }`}
                        >
                          {session.price}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Select a Date & Time
                </h4>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Type
                  </label>
                  <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    {activeMentor.sessionTypes.map((session, index) => (
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
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                      9:00 AM
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                      10:00 AM
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                      11:00 AM
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                      1:00 PM
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                      2:00 PM
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700">
                      3:00 PM
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={closeBookingModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-3"
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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

export default MentorHome;
