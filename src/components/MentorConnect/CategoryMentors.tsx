import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  StarIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  FilterIcon,
  ChevronDownIcon,
  CodeIcon,
  BarChart3Icon,
  BriefcaseIcon,
  TrendingUpIcon,
  PenToolIcon,
  LayoutIcon,
  SearchIcon,
} from "lucide-react";

interface Mentor {
  _id: string | number;
  fullName: string;
  professionalTitle: string;
  rating: number;
  reviews: number;
  isFree?: boolean;
  offerFreeIntro?: boolean;
  areasOfExpertise: string[];
  skills?: string[];
  profileImage?: string;
  bio: string;
  availability: string[];
  sessionTypes: {
    type: string;
    duration: string;
    price: string;
  }[];
}

interface Category {
  id: number;
  name: string;
  color: string;
  textColor: string;
  iconColor: string;
  description: string;
  icon: React.ReactNode;
}

export const CategoryMentors = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMentor, setActiveMentor] = useState<Mentor | null>(null);
  const [sortBy, setSortBy] = useState("rating");
  const [filterBy, setFilterBy] = useState("all");

  // Categories mapping
  const categories: Category[] = [
    {
      id: 1,
      name: "Software Development",
      color: "bg-blue-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Learn backend & frontend technologies",
      icon: <CodeIcon className="w-6 h-6" />,
    },
    {
      id: 2,
      name: "Data Science",
      color: "bg-purple-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Master analytics & machine learning",
      icon: <BarChart3Icon className="w-6 h-6" />,
    },
    {
      id: 3,
      name: "Business",
      color: "bg-green-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Strategy, management & leadership",
      icon: <BriefcaseIcon className="w-6 h-6" />,
    },
    {
      id: 4,
      name: "Marketing",
      color: "bg-red-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Growth, SEO & content strategy",
      icon: <TrendingUpIcon className="w-6 h-6" />,
    },
    {
      id: 5,
      name: "Design",
      color: "bg-yellow-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "UX/UI & product design",
      icon: <PenToolIcon className="w-6 h-6" />,
    },
    {
      id: 6,
      name: "Product Management",
      color: "bg-indigo-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Product strategy & roadmapping",
      icon: <LayoutIcon className="w-6 h-6" />,
    },
  ];

  const currentCategory = categories.find(
    (cat) => cat.id === parseInt(categoryId || "1")
  );

  // Function to categorize mentors based on their skills - same as MentorHome
  const categorizeMentor = (mentor: Mentor) => {
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

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        // Use the same sample data as MentorHome for consistency
        const sampleMentors = [
          {
            _id: "1",
            fullName: "Sarah Johnson",
            professionalTitle: "Senior Software Engineer at Google",
            rating: 4.9,
            reviews: 156,
            isFree: true,
            areasOfExpertise: ["JavaScript", "React", "Node.js", "Python"],
            profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "Senior Software Engineer at Google with 8+ years of experience in full-stack development. Previously worked at Facebook and Amazon. Passionate about mentoring and helping developers grow their careers.",
            availability: ["Mon & Wed: 7pm-9pm EST", "Sat: 10am-2pm EST"],
            sessionTypes: [
              {
                type: "Code Review Session",
                duration: "30 min",
                price: "Free",
              },
              {
                type: "Technical Interview Prep",
                duration: "60 min",
                price: "$75",
              },
              {
                type: "Project Architecture Review",
                duration: "45 min",
                price: "$60",
              },
            ],
          },
          {
            _id: "2",
            fullName: "Michael Chen",
            professionalTitle: "Data Scientist at Netflix",
            rating: 4.8,
            reviews: 89,
            isFree: false,
            areasOfExpertise: [
              "Python",
              "Machine Learning",
              "SQL",
              "Statistics",
            ],
            profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
            bio: "Data Scientist at Netflix with 6+ years of experience in machine learning and data analysis. Previously worked at Spotify and Uber. Expert in recommendation systems and predictive modeling.",
            availability: ["Tue & Thu: 6pm-8pm EST", "Sun: 2pm-6pm EST"],
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
            _id: "3",
            fullName: "Emily Rodriguez",
            professionalTitle: "Product Manager at Airbnb",
            rating: 4.7,
            reviews: 203,
            isFree: true,
            areasOfExpertise: [
              "Product Strategy",
              "User Research",
              "Agile",
              "Analytics",
            ],
            profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
            bio: "Product Manager at Airbnb with 10+ years of experience in product management and strategy. Previously led product teams at Uber and Lyft. Expert in user-centered design and data-driven decision making.",
            availability: ["Mon & Fri: 6pm-8pm EST", "Sat: 1pm-5pm EST"],
            sessionTypes: [
              {
                type: "Product Strategy Session",
                duration: "30 min",
                price: "Free",
              },
              {
                type: "User Research Workshop",
                duration: "60 min",
                price: "$80",
              },
              {
                type: "Product Roadmap Planning",
                duration: "45 min",
                price: "$65",
              },
            ],
          },
          {
            _id: "4",
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
        ];

        // Filter mentors by the selected category
        const categoryIdNum = parseInt(categoryId || "1");
        const filteredMentors = sampleMentors.filter(
          (mentor: Mentor) => categorizeMentor(mentor) === categoryIdNum
        );
        setMentors(filteredMentors);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [categoryId]);

  const handleBookSession = (mentor: Mentor, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMentor(mentor);
  };

  const closeBookingModal = () => {
    setActiveMentor(null);
  };

  const sortedMentors = [...mentors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "reviews":
        return (b.reviews || 0) - (a.reviews || 0);
      case "name":
        return a.fullName.localeCompare(b.fullName);
      default:
        return 0;
    }
  });

  const filteredMentors = sortedMentors.filter((mentor) => {
    if (filterBy === "free") {
      return mentor.isFree || mentor.offerFreeIntro;
    }
    return true;
  });

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Category not found
          </h1>
          <Link
            to="/mentor-connect"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to MentorConnect
          </Link>
        </div>
      </div>
    );
  }

  // Category descriptions
  const categoryDescriptions: Record<
    string,
    { headline: string; description: string }
  > = {
    "Software Development": {
      headline: "Looking to break into tech or grow as a developer?",
      description:
        "Connect with experienced software engineers to sharpen your coding skills and build real-world projects.",
    },
    "Data Science": {
      headline: "Curious about data and how to make sense of it?",
      description:
        "Learn from data scientists who've tackled real business problems using analytics, ML, and storytelling.",
    },
    Business: {
      headline: "Want to think like a leader and act with impact?",
      description:
        "Gain insights from business mentors with experience in strategy, operations, and entrepreneurship.",
    },
    Marketing: {
      headline: "Ready to master the art and science of marketing?",
      description:
        "Work with marketing professionals to build skills in branding, digital strategy, and content creation.",
    },
    Design: {
      headline: "Want to design experiences that stand out?",
      description:
        "Learn UI/UX, product design, and creative best practices from mentors with hands-on industry experience.",
    },
    "Project Management": {
      headline: "Hoping to lead teams and deliver results with confidence?",
      description:
        "Get guidance from project managers skilled in agile, stakeholder management, and team leadership.",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Blue Header Section with Dots Pattern */}
      <div className="relative bg-blue-600 text-white overflow-hidden">
        {/* Dots Pattern Background */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/mentor-connect"
              className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all"
            >
              <ArrowLeftIcon size={16} className="mr-2" />
              Back to categories
            </Link>
          </div>

          {/* Category Header */}
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mr-6">
              <div className="text-white text-2xl">{currentCategory.icon}</div>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {currentCategory.name}
              </h1>
              <p className="text-blue-100 text-xl">
                {categoryDescriptions[currentCategory.name]?.description ||
                  `Learn from experienced professionals in ${currentCategory.name.toLowerCase()}`}
              </p>
            </div>
          </div>

          {/* Information Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg">
              <UserIcon size={20} className="mr-2" />
              <span className="font-medium">
                {mentors.length} mentors available
              </span>
            </div>
            <div className="flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg">
              <StarIcon size={20} className="mr-2" />
              <span className="font-medium">
                Expert guidance in {currentCategory.name.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Curved Separator */}
        <div className="relative">
          <svg
            className="w-full h-16"
            viewBox="0 0 1200 64"
            preserveAspectRatio="none"
          >
            <path
              d="M0,64 L1200,64 L1200,0 C800,32 400,32 0,0 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* White Content Section */}
      <div className="bg-white">
        {/* Search and Filter Bar */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <SearchIcon
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search mentors..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Session type:
                </span>
                <select className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All sessions</option>
                  <option>Free sessions only</option>
                  <option>Paid sessions only</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Sort by:
                </span>
                <select className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Recommended</option>
                  <option>Highest rated</option>
                  <option>Most reviews</option>
                  <option>Name A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="container mx-auto px-4 pb-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading mentors...</p>
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No mentors found
              </h3>
              <p className="text-gray-600 mb-4">
                No mentors are available in this category at the moment.
              </p>
              <Link
                to="/mentor-connect"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Browse All Categories
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                  <div
                    key={mentor._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6 h-80 flex flex-col"
                  >
                    {/* Mentor Header */}
                    <div className="flex items-start mb-4 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4 flex-shrink-0">
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
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-400 text-white font-bold text-lg">
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
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                          {mentor.fullName}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {mentor.professionalTitle}
                        </p>
                        <div className="flex items-center mb-2">
                          <StarIcon
                            size={16}
                            className="text-yellow-400 fill-current flex-shrink-0"
                          />
                          <span className="ml-1 text-gray-900 font-medium text-sm">
                            {mentor.rating || 4.5} ({mentor.reviews || 0}{" "}
                            reviews)
                          </span>
                        </div>
                        {mentor.isFree || mentor.offerFreeIntro ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircleIcon
                              size={16}
                              className="mr-1 flex-shrink-0"
                            />
                            <span className="text-sm font-medium">
                              Free Session Available
                            </span>
                          </div>
                        ) : (
                          <div className="h-6"></div>
                        )}
                      </div>
                    </div>

                    {/* Expertise */}
                    <div className="mb-4 flex-1">
                      <p className="text-sm text-gray-700 font-medium mb-3">
                        Expertise:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(mentor.areasOfExpertise || [])
                          .slice(0, 4)
                          .map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        {(mentor.areasOfExpertise || []).length > 4 && (
                          <span className="text-xs text-gray-500">
                            +{(mentor.areasOfExpertise || []).length - 4} more
                          </span>
                        )}
                        {/* Fill empty space if less than 4 skills */}
                        {Array.from({
                          length: Math.max(
                            0,
                            4 - (mentor.areasOfExpertise || []).length
                          ),
                        }).map((_, index) => (
                          <span
                            key={`empty-${index}`}
                            className="text-xs bg-transparent px-3 py-1 invisible"
                          >
                            Placeholder
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Book Session Button */}
                    <button
                      onClick={(e) => handleBookSession(mentor, e)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium flex-shrink-0"
                    >
                      <CalendarIcon size={16} className="mr-2" />
                      Book Session
                    </button>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              <div className="text-center mt-8">
                <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Load More Mentors
                </button>
              </div>
            </>
          )}
        </div>
      </div>

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
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
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
                    {(activeMentor.isFree || activeMentor.offerFreeIntro) && (
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
                    <CalendarIcon size={18} className="mr-2 text-blue-600" />
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
                    <CalendarIcon size={18} className="mr-2 text-blue-600" />
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

export default CategoryMentors;
