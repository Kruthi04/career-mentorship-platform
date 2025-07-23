import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  SearchIcon,
  StarIcon,
  FilterIcon,
  CheckCircleIcon,
  PenIcon,
  BarChartIcon,
  TagIcon,
  MessageCircleIcon,
  MinusIcon,
  XIcon,
  SendIcon,
  MaximizeIcon,
  BriefcaseIcon,
  LayoutIcon,
  DatabaseIcon,
  PenToolIcon,
  SmartphoneIcon,
  MonitorIcon,
  ServerIcon,
} from "lucide-react";
export const InsightHome = () => {
  const [activeTab, setActiveTab] = useState("popular");
  const [chatbotMinimized, setChatbotMinimized] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const categories = [
    {
      id: "crm",
      name: "CRM Software",
      count: 142,
      color: "bg-blue-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Customer relationship management tools",
      icon: <BriefcaseIcon className="w-6 h-6" />,
      popularTools: ["Salesforce", "HubSpot", "Zoho CRM"],
    },
    {
      id: "marketing",
      name: "Marketing Tools",
      count: 98,
      color: "bg-green-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Email, social media & campaign platforms",
      icon: <LayoutIcon className="w-6 h-6" />,
      popularTools: ["Mailchimp", "Marketo", "Buffer"],
    },
    {
      id: "design",
      name: "Design & UX",
      count: 76,
      color: "bg-purple-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "UI/UX design & prototyping tools",
      icon: <PenToolIcon className="w-6 h-6" />,
      popularTools: ["Figma", "Adobe XD", "Sketch"],
    },
    {
      id: "productivity",
      name: "Productivity",
      count: 65,
      color: "bg-yellow-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Task management & collaboration tools",
      icon: <BarChartIcon className="w-6 h-6" />,
      popularTools: ["Notion", "Asana", "Monday.com"],
    },
    {
      id: "development",
      name: "Development",
      count: 89,
      color: "bg-red-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Coding, testing & version control",
      icon: <ServerIcon className="w-6 h-6" />,
      popularTools: ["GitHub", "VS Code", "Jira"],
    },
    {
      id: "analytics",
      name: "Analytics",
      count: 54,
      color: "bg-indigo-500",
      textColor: "text-white",
      iconColor: "text-white",
      description: "Data analysis & visualization tools",
      icon: <DatabaseIcon className="w-6 h-6" />,
      popularTools: ["Google Analytics", "Tableau", "Mixpanel"],
    },
  ];
  const handleCategoryClick = (category) => {
    if (activeCategory === category.id) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category.id);
    }
  };
  const products = [
    {
      id: 1,
      name: "Salesforce",
      category: "CRM Software",
      rating: 4.7,
      reviews: 1247,
      description:
        "Customer relationship management platform for sales, service, marketing, and more.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
      verified: true,
    },
    {
      id: 2,
      name: "HubSpot",
      category: "Marketing Tools",
      rating: 4.5,
      reviews: 987,
      description: "All-in-one inbound marketing, sales, and service platform.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Hubspot_Logo.svg/1200px-Hubspot_Logo.svg.png",
      verified: true,
    },
    {
      id: 3,
      name: "Figma",
      category: "Design & UX",
      rating: 4.9,
      reviews: 842,
      description: "Collaborative interface design tool for teams.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
      verified: true,
    },
    {
      id: 4,
      name: "Notion",
      category: "Productivity",
      rating: 4.8,
      reviews: 756,
      description:
        "All-in-one workspace for notes, tasks, wikis, and databases.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
      verified: true,
    },
    {
      id: 5,
      name: "GitHub",
      category: "Development",
      rating: 4.6,
      reviews: 1389,
      description:
        "Code hosting platform for version control and collaboration.",
      logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      verified: true,
    },
    {
      id: 6,
      name: "Google Analytics",
      category: "Analytics",
      rating: 4.4,
      reviews: 1024,
      description:
        "Web analytics service that tracks and reports website traffic.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Logo_Google_Analytics.svg/1200px-Logo_Google_Analytics.svg.png",
      verified: true,
    },
  ];
  return (
    <div className="w-full bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative text-white py-12 md:py-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="People discussing software"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900 opacity-75"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Real software reviews from real users
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Help over 5 million monthly buyers make the right choice for their
              business.
            </p>

            <div className="mt-6 flex items-center">
              <Link to="#" className="text-white underline hover:text-blue-200">
                Using software? Write a review
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Enhanced Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Browse Categories
            </h2>
            <Link to="#" className="text-blue-600 hover:text-blue-800">
              View all categories
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`${
                  category.color
                } rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer ${
                  activeCategory === category.id ? "ring-2 ring-white" : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-4`}
                >
                  <div className={category.iconColor}>{category.icon}</div>
                </div>
                <h3 className={`font-bold ${category.textColor} text-lg`}>
                  {category.name}
                </h3>
                <p className="text-sm text-white text-opacity-90 mt-1 mb-2">
                  {category.description}
                </p>
                <div className="flex items-center text-white text-opacity-80 text-sm">
                  <TagIcon size={14} className="mr-1" />
                  <span>{category.count} products</span>
                </div>
                {/* Expanded content when active */}
                {activeCategory === category.id && (
                  <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                    <p className="text-sm text-white text-opacity-90 mb-3">
                      Popular tools in this category:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {category.popularTools.map((tool, index) => (
                        <span
                          key={index}
                          className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full text-white"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                    <button className="mt-3 text-sm text-white hover:underline">
                      View all products
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Top Software Products
            </h2>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Filter by:</span>
              <button className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-1 text-gray-700">
                <FilterIcon size={16} className="mr-2" />
                All Categories
              </button>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "popular"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("popular")}
            >
              Most Popular
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "highest"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("highest")}
            >
              Highest Rated
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "trending"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("trending")}
            >
              Trending
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "new"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("new")}
            >
              Newly Added
            </button>
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={product.logo}
                      alt={product.name}
                      className="w-12 h-12 object-contain mr-4"
                    />
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-bold text-gray-800">
                          {product.name}
                        </h3>
                        {product.verified && (
                          <CheckCircleIcon
                            size={16}
                            className="ml-1 text-blue-600"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-yellow-400 mr-2">
                      <StarIcon size={16} />
                      <span className="ml-1 text-gray-800">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  <div className="flex justify-between">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      View Reviews
                    </button>
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
                      Write a Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
              Load More Products
            </button>
          </div>
        </div>
      </section>
      {/* Expert Reviews Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Expert Reviews
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              In-depth analysis and reviews from industry professionals and
              technology experts.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="CRM Comparison"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Expert Opinion
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  The Ultimate CRM Comparison: Salesforce vs HubSpot vs Zoho
                </h3>
                <p className="text-gray-600 mb-4">
                  An in-depth analysis of the top CRM platforms, their
                  strengths, weaknesses, and ideal use cases.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Expert"
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <span className="text-sm text-gray-700">David Wilson</span>
                  </div>
                  <span className="text-sm text-gray-500">2 days ago</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Design Tools"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Expert Opinion
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  The Designer's Toolkit: Figma vs Adobe XD vs Sketch
                </h3>
                <p className="text-gray-600 mb-4">
                  Which design tool is right for your team? We compare features,
                  workflows, and collaboration capabilities.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Expert"
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <span className="text-sm text-gray-700">Sarah Johnson</span>
                  </div>
                  <span className="text-sm text-gray-500">1 week ago</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Analytics Platforms"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Expert Opinion
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  Analytics Showdown: Google Analytics vs Mixpanel vs Amplitude
                </h3>
                <p className="text-gray-600 mb-4">
                  A comprehensive guide to choosing the right analytics platform
                  for your business needs.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src="https://randomuser.me/api/portraits/men/75.jpg"
                      alt="Expert"
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <span className="text-sm text-gray-700">Michael Chen</span>
                  </div>
                  <span className="text-sm text-gray-500">3 weeks ago</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
              View All Expert Reviews
            </button>
          </div>
        </div>
      </section>
      {/* Write a Review CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 rounded-lg shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-2/3 p-8 md:p-12 text-white">
                <h2 className="text-2xl font-bold mb-4">
                  Using software? Write a review.
                </h2>
                <p className="text-blue-100 mb-6">
                  Your insights help others make informed decisions. Share your
                  experience with software tools you've used.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-blue-500 p-2 rounded-full mr-3">
                      <PenIcon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Share Your Experience</h3>
                      <p className="text-blue-100">
                        Help others understand the pros and cons of the tools
                        you've used
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-500 p-2 rounded-full mr-3">
                      <BarChartIcon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Rate Features</h3>
                      <p className="text-blue-100">
                        Provide detailed ratings across different aspects of the
                        software
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-500 p-2 rounded-full mr-3">
                      <TagIcon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Earn Reviewer Status</h3>
                      <p className="text-blue-100">
                        Become a verified reviewer and gain recognition in the
                        community
                      </p>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-blue-50">
                  Write a Review
                </button>
              </div>
              <div className="md:w-1/3 bg-blue-700 flex items-center justify-center p-8">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                  alt="Review"
                  className="rounded-lg shadow-lg max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Cross-Promotion Section */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:mr-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Need help picking a tool?
              </h3>
              <p className="text-gray-600 mb-4">
                Book a free session with a mentor on MentorConnect to get
                personalized advice on choosing the right software for your
                needs.
              </p>
              <Link
                to="/mentor-connect"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
              >
                Find a Mentor
              </Link>
            </div>
            <div className="md:w-1/3">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt="Mentorship"
                className="rounded-md w-full"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-40">
        {showChatbot && !chatbotMinimized && (
          <div className="bg-white rounded-lg shadow-xl w-80 mb-4 overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-medium">Career Assistant</h3>
              <div className="flex items-center">
                <button
                  onClick={() => setChatbotMinimized(true)}
                  className="text-white hover:text-blue-200 mr-2"
                >
                  <MinusIcon size={18} />
                </button>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="text-white hover:text-blue-200"
                >
                  <XIcon size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 h-80 overflow-y-auto bg-gray-50">
              <div className="mb-3">
                <div className="bg-blue-100 text-blue-800 rounded-lg p-3 inline-block max-w-[80%]">
                  <p>
                    Hello! I'm your Career assistant. How can I help you find
                    the right service today?
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                  <SendIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            if (chatbotMinimized) {
              setChatbotMinimized(false);
            } else {
              setShowChatbot(!showChatbot);
            }
          }}
          className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors relative"
        >
          {showChatbot && chatbotMinimized ? (
            <MaximizeIcon size={24} />
          ) : (
            <>
              <MessageCircleIcon size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                1
              </span>
            </>
          )}
        </button>
        {!showChatbot && (
          <div className="absolute bottom-16 right-0 bg-white px-3 py-2 rounded-lg shadow-md text-sm font-medium text-gray-700 whitespace-nowrap">
            Need help choosing a service?
          </div>
        )}
      </div>
    </div>
  );
};
