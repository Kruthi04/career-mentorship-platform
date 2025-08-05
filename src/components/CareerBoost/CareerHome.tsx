import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileTextIcon,
  LinkedinIcon,
  UserIcon,
  CheckIcon,
  UploadIcon,
  MessageCircleIcon,
  MinusIcon,
  XIcon,
  SendIcon,
  MaximizeIcon,
} from "lucide-react";

export const CareerHome = () => {
  const [chatbotMinimized, setChatbotMinimized] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>("resume");

  const services = [
    {
      id: "resume",
      title: "Resume Review",
      icon: <FileTextIcon size={24} className="text-blue-600" />,
      description:
        "Get expert feedback on your resume to stand out to recruiters and hiring managers.",
      features: [
        "Detailed written feedback",
        "ATS optimization tips",
        "Industry-specific recommendations",
        "Follow-up consultation",
      ],
      price: "Free",
      popular: true,
      link: "/career-boost/resume-review",
    },
    {
      id: "linkedin",
      title: "LinkedIn Profile Fix",
      icon: <LinkedinIcon size={24} className="text-blue-700" />,
      description:
        "Optimize your LinkedIn profile to attract recruiters and showcase your expertise.",
      features: [
        "Headline and summary optimization",
        "Experience section enhancement",
        "Skills and endorsements strategy",
        "Profile visibility tips",
      ],
      price: "Free",
      popular: false,
      link: "/career-boost/linkedin-fix",
    },
    {
      id: "interview",
      title: "Interview Preparation",
      icon: <UserIcon size={24} className="text-gray-600" />,
      description:
        "Practice with industry experts to ace your upcoming interviews.",
      features: [
        "60-minute mock interview",
        "Personalized feedback",
        "Common questions preparation",
        "Follow-up strategy session",
      ],
      price: "Free",
      popular: false,
      link: "/career-boost/interview-prep",
    },
    {
      id: "referral",
      title: "Get a Referral",
      icon: <CheckIcon size={24} className="text-blue-600" />,
      description:
        "Connect with professionals who can refer you to their companies.",
      features: [
        "Access to referral network",
        "Application review before referral",
        "Direct introduction to hiring team",
        "Follow-up guidance",
      ],
      price: "Free",
      popular: false,
      link: "/career-boost/get-referral",
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Career professionals collaborating"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-700 opacity-70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Looking for the next step in your career? Talk to an expert
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Get personalized guidance from industry professionals to
              accelerate your career growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/mentor-connect"
                className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Find a Mentor
              </Link>
              <Link
                to="/career-boost"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Career Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              Choose from our range of professional services designed to help
              you succeed in your career journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer relative ${
                  selectedCard === service.id
                    ? "ring-2 ring-blue-500 shadow-xl transform scale-105 bg-blue-50"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCard(
                    selectedCard === service.id ? null : service.id
                  )
                }
              >
                {service.popular && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon
                        size={16}
                        className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-blue-600">
                    {service.price}
                  </span>
                  <Link
                    to={service.link}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            How CareerBoost Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <FileTextIcon size={32} className="text-blue-600" />
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-blue-100 -z-0"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Choose a Service
              </h3>
              <p className="text-gray-600">
                Select the service that best fits your current career needs and
                goals.
              </p>
            </div>
            <div className="text-center relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <UploadIcon size={32} className="text-blue-600" />
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-blue-100 -z-0"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Submit Your Materials
              </h3>
              <p className="text-gray-600">
                Upload your resume, LinkedIn profile, or other relevant
                materials for review.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Get Expert Feedback
              </h3>
              <p className="text-gray-600">
                Receive detailed feedback and guidance from industry
                professionals.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 80"
          className="fill-gray-50 w-full"
        >
          <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
        </svg>
      </div>
      {/* Resume Upload Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to get started?
                </h2>
                <p className="text-gray-600 mb-6">
                  Upload your resume now for a free initial assessment. Our
                  experts will provide a brief overview of how we can help you
                  improve.
                </p>
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Resume
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
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
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Get Free Assessment
                </button>
              </div>
              <div className="md:w-1/2 bg-blue-600 p-8 md:p-12 text-white">
                <h3 className="text-xl font-bold mb-4">
                  Why Choose CareerBoost?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckIcon size={20} className="mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Industry experts with proven track records at top
                      companies
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={20} className="mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Personalized feedback tailored to your specific goals
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={20} className="mr-2 mt-1 flex-shrink-0" />
                    <span>Actionable advice you can implement immediately</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={20} className="mr-2 mt-1 flex-shrink-0" />
                    <span>
                      Ongoing support to help you throughout your job search
                    </span>
                  </li>
                </ul>
                <div className="mt-8 pt-6 border-t border-blue-500">
                  <h4 className="font-medium mb-3">What our clients say:</h4>
                  <div className="bg-blue-700 rounded-lg p-4">
                    <p className="italic mb-3">
                      "The resume review service was a game-changer for my job
                      search. I started getting interview calls within days of
                      updating my resume with their suggestions."
                    </p>
                    <div className="flex items-center">
                      <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        alt="Client"
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium">Michael Chen</p>
                        <p className="text-sm text-blue-200">
                          Software Engineer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
                Need help choosing the right software tools?
              </h3>
              <p className="text-gray-600 mb-4">
                Check out InsightBoard for authentic reviews from real users to
                help you make informed decisions about software tools.
              </p>
              <Link
                to="/insight-board"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
              >
                Read Reviews on InsightBoard
              </Link>
            </div>
            <div className="md:w-1/3">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt="Software review"
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
