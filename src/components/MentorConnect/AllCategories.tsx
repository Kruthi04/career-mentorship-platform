import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, UserIcon, CodeIcon, BriefcaseIcon, TrendingUpIcon, PenToolIcon, LayoutIcon, GlobeIcon, ShieldIcon, DatabaseIcon, ServerIcon, SmartphoneIcon, HeadphonesIcon, CameraIcon, CloudIcon, BellIcon, AwardIcon, Plus, BookIcon, DollarSignIcon } from 'lucide-react';
export const AllCategories = () => {
  const categories = [{
    id: 1,
    name: 'Software Development',
    count: 124,
    color: 'bg-blue-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Learn backend & frontend technologies',
    icon: <CodeIcon className="w-6 h-6" />
  }, {
    id: 2,
    name: 'Data Science',
    count: 87,
    color: 'bg-purple-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Master analytics & machine learning',
    icon: <div className="w-6 h-6" />
  }, {
    id: 3,
    name: 'Business',
    count: 56,
    color: 'bg-green-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Strategy, management & leadership',
    icon: <BriefcaseIcon className="w-6 h-6" />
  }, {
    id: 4,
    name: 'Marketing',
    count: 42,
    color: 'bg-red-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Growth, SEO & content strategy',
    icon: <TrendingUpIcon className="w-6 h-6" />
  }, {
    id: 5,
    name: 'Design',
    count: 38,
    color: 'bg-yellow-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'UX/UI & product design',
    icon: <PenToolIcon className="w-6 h-6" />
  }, {
    id: 6,
    name: 'Product Management',
    count: 31,
    color: 'bg-indigo-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Product strategy & roadmapping',
    icon: <LayoutIcon className="w-6 h-6" />
  }, {
    id: 7,
    name: 'DevOps',
    count: 28,
    color: 'bg-teal-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'CI/CD, cloud infrastructure & automation',
    icon: <ServerIcon className="w-6 h-6" />
  }, {
    id: 8,
    name: 'Mobile Development',
    count: 35,
    color: 'bg-orange-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'iOS, Android & cross-platform apps',
    icon: <SmartphoneIcon className="w-6 h-6" />
  }, {
    id: 9,
    name: 'Cybersecurity',
    count: 22,
    color: 'bg-gray-700',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Security best practices & threat prevention',
    icon: <ShieldIcon className="w-6 h-6" />
  }, {
    id: 10,
    name: 'AI & Machine Learning',
    count: 41,
    color: 'bg-pink-500',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Deep learning, NLP & computer vision',
    icon: <DatabaseIcon className="w-6 h-6" />
  }, {
    id: 11,
    name: 'Cloud Computing',
    count: 33,
    color: 'bg-blue-400',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'AWS, Azure, GCP & cloud architecture',
    icon: <CloudIcon className="w-6 h-6" />
  }, {
    id: 12,
    name: 'Customer Support',
    count: 19,
    color: 'bg-green-400',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Client management & service excellence',
    icon: <HeadphonesIcon className="w-6 h-6" />
  }, {
    id: 13,
    name: 'Content Creation',
    count: 27,
    color: 'bg-purple-400',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Writing, video production & podcasting',
    icon: <CameraIcon className="w-6 h-6" />
  }, {
    id: 14,
    name: 'Entrepreneurship',
    count: 24,
    color: 'bg-red-400',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Startups, funding & business growth',
    icon: <AwardIcon className="w-6 h-6" />
  }, {
    id: 15,
    name: 'Education',
    count: 21,
    color: 'bg-blue-300',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Teaching, curriculum design & EdTech',
    icon: <BookIcon className="w-6 h-6" />
  }, {
    id: 16,
    name: 'Finance',
    count: 29,
    color: 'bg-green-600',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Financial planning, investing & analysis',
    icon: <DollarSignIcon className="w-6 h-6" />
  }, {
    id: 17,
    name: 'International Business',
    count: 18,
    color: 'bg-indigo-400',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Global markets & cross-cultural management',
    icon: <GlobeIcon className="w-6 h-6" />
  }, {
    id: 18,
    name: 'Project Management',
    count: 32,
    color: 'bg-yellow-600',
    textColor: 'text-white',
    iconColor: 'text-white',
    description: 'Planning, execution & team leadership',
    icon: <BellIcon className="w-6 h-6" />
  }];
  return <div className="w-full bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/mentor-connect" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to MentorConnect
          </Link>
        </div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            All Categories
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Browse all mentor categories to find the perfect expert for your
            needs. Each category features verified professionals ready to help
            you accelerate your career.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map(category => <Link key={category.id} to={`/mentor-connect?category=${category.id}`} className={`${category.color} rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}>
              <div className={`w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-4`}>
                <div className={category.iconColor}>{category.icon}</div>
              </div>
              <h3 className={`font-bold ${category.textColor} text-lg`}>
                {category.name}
              </h3>
              <p className="text-sm text-white text-opacity-90 mt-1 mb-2">
                {category.description}
              </p>
              <div className="flex items-center text-white text-opacity-80 text-sm">
                <UserIcon size={14} className="mr-1" />
                <span>{category.count} mentors</span>
              </div>
            </Link>)}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Don't see what you're looking for?
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
            <Plus size={16} className="mr-2" />
            Request a New Category
          </button>
        </div>
      </div>
    </div>;
};