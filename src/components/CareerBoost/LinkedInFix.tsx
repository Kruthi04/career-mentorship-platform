import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LinkedinIcon, ArrowLeftIcon, CheckIcon, ClockIcon, StarIcon, UserIcon, MessageSquareIcon, BarChartIcon, AlertCircleIcon, EyeIcon } from 'lucide-react';
export const LinkedInFix = () => {
  const [step, setStep] = useState(1);
  const [profileUrl, setProfileUrl] = useState('');
  const [objectives, setObjectives] = useState([]);
  const [industry, setIndustry] = useState('');
  const [jobSearchStatus, setJobSearchStatus] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [feedback, setFeedback] = useState(false);
  const handleObjectiveChange = objective => {
    if (objectives.includes(objective)) {
      setObjectives(objectives.filter(obj => obj !== objective));
    } else {
      setObjectives([...objectives, objective]);
    }
  };
  const nextStep = () => {
    if (step < 3) {
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
  const submitForm = () => {
    setFeedback(true);
    setStep(3);
    window.scrollTo(0, 0);
  };
  return <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-16">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1611944212129-29977ae1398c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" alt="LinkedIn profile" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900 opacity-80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center mb-8">
            <Link to="/career-boost" className="flex items-center text-blue-200 hover:text-white">
              <ArrowLeftIcon size={16} className="mr-2" />
              Back to Services
            </Link>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">
              LinkedIn Profile Optimization
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Attract more recruiters and showcase your expertise with a
              professionally optimized LinkedIn profile.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <ClockIcon size={18} className="mr-2" />
                <span>72-hour turnaround</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <StarIcon size={18} className="mr-2" />
                <span>LinkedIn specialists</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <CheckIcon size={18} className="mr-2" />
                <span>Keyword optimization</span>
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
                  Step {step} of 3
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(step / 3 * 100)}% Complete
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-600 rounded-full transition-all duration-300" style={{
                width: `${step / 3 * 100}%`
              }}></div>
              </div>
            </div>
            {/* Step 1: LinkedIn Profile URL */}
            {step === 1 && <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Your LinkedIn Profile
                </h2>
                <p className="text-gray-600 mb-8">
                  Please provide your LinkedIn profile URL so our experts can
                  review it.
                </p>
                <div className="mb-8">
                  <label htmlFor="profileUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile URL
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkedinIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="url" id="profileUrl" value={profileUrl} onChange={e => setProfileUrl(e.target.value)} className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://www.linkedin.com/in/yourname" required />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Tip: To find your profile URL, go to your LinkedIn profile,
                    click "Edit public profile &amp; URL" on the right side.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    <AlertCircleIcon size={20} className="mr-2" />
                    Privacy Note
                  </h3>
                  <p className="text-gray-700 mb-2">
                    Make sure your profile is set to public so our experts can
                    view it. We'll only use your profile information for the
                    purpose of providing feedback.
                  </p>
                  <p className="text-gray-700">
                    You can adjust your privacy settings in LinkedIn by going to
                    Settings &amp; Privacy &gt; Visibility.
                  </p>
                </div>
                <div className="flex justify-between mt-8">
                  <Link to="/career-boost" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Cancel
                  </Link>
                  <button onClick={nextStep} disabled={!profileUrl} className={`px-6 py-2 rounded-md ${profileUrl ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                    Next
                  </button>
                </div>
              </div>}
            {/* Step 2: Additional Information */}
            {step === 2 && <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Optimization Goals
                </h2>
                <p className="text-gray-600 mb-8">
                  Help us understand your goals for your LinkedIn profile
                  optimization.
                </p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What are your objectives for your LinkedIn profile?
                      (Select all that apply)
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-start">
                        <input id="job-search" type="checkbox" checked={objectives.includes('job-search')} onChange={() => handleObjectiveChange('job-search')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                        <label htmlFor="job-search" className="ml-2 block text-sm text-gray-700">
                          Job search - attract recruiters and hiring managers
                        </label>
                      </div>
                      <div className="flex items-start">
                        <input id="networking" type="checkbox" checked={objectives.includes('networking')} onChange={() => handleObjectiveChange('networking')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                        <label htmlFor="networking" className="ml-2 block text-sm text-gray-700">
                          Professional networking - connect with peers and
                          industry leaders
                        </label>
                      </div>
                      <div className="flex items-start">
                        <input id="thought-leadership" type="checkbox" checked={objectives.includes('thought-leadership')} onChange={() => handleObjectiveChange('thought-leadership')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                        <label htmlFor="thought-leadership" className="ml-2 block text-sm text-gray-700">
                          Thought leadership - establish yourself as an expert
                          in your field
                        </label>
                      </div>
                      <div className="flex items-start">
                        <input id="business-development" type="checkbox" checked={objectives.includes('business-development')} onChange={() => handleObjectiveChange('business-development')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                        <label htmlFor="business-development" className="ml-2 block text-sm text-gray-700">
                          Business development - attract clients or partners
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select id="industry" value={industry} onChange={e => setIndustry(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
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
                    <label htmlFor="jobSearchStatus" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Search Status
                    </label>
                    <select id="jobSearchStatus" value={jobSearchStatus} onChange={e => setJobSearchStatus(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                      <option value="">Select your job search status</option>
                      <option value="actively-looking">
                        Actively looking for new opportunities
                      </option>
                      <option value="open-to-opportunities">
                        Open to opportunities but not actively searching
                      </option>
                      <option value="not-looking">
                        Not looking for a job change
                      </option>
                      <option value="confidential">
                        Confidential job search
                      </option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="targetRole" className="block text-sm font-medium text-gray-700 mb-1">
                      Target Role (if applicable)
                    </label>
                    <input type="text" id="targetRole" value={targetRole} onChange={e => setTargetRole(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Senior Product Manager, Marketing Director" />
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Back
                  </button>
                  <button onClick={submitForm} disabled={objectives.length === 0 || !industry || !jobSearchStatus} className={`px-6 py-2 rounded-md ${objectives.length > 0 && industry && jobSearchStatus ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                    Submit
                  </button>
                </div>
              </div>}
            {/* Step 3: Confirmation */}
            {step === 3 && <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckIcon size={32} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Profile Submitted Successfully!
                  </h2>
                  <p className="text-gray-600">
                    Thank you for submitting your LinkedIn profile. Our experts
                    will review it and provide optimization recommendations
                    within 72 hours.
                  </p>
                </div>
                {feedback && <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                      What happens next?
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-blue-800">
                          1
                        </span>
                        <p>
                          Our LinkedIn specialists will analyze your profile
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-blue-800">
                          2
                        </span>
                        <p>
                          You'll receive a detailed optimization report with
                          specific recommendations
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-blue-800">
                          3
                        </span>
                        <p>
                          Schedule a follow-up call to discuss implementation
                          strategies
                        </p>
                      </li>
                    </ul>
                  </div>}
                <div className="flex justify-center">
                  <Link to="/career-boost" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Return to Services
                  </Link>
                </div>
              </div>}
          </div>
        </div>
      </section>
      {/* What's Included Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            What's Included in Our LinkedIn Profile Fix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UserIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Headline & Summary
              </h3>
              <p className="text-gray-600">
                Compelling headline and summary that showcase your unique value
                proposition and attract recruiters.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquareIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Experience Enhancement
              </h3>
              <p className="text-gray-600">
                Optimized experience descriptions that highlight achievements
                and use relevant keywords for your industry.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BarChartIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Skills & Endorsements
              </h3>
              <p className="text-gray-600">
                Strategic selection of skills that align with your career goals
                and recommendations for obtaining endorsements.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <EyeIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Profile Visibility
              </h3>
              <p className="text-gray-600">
                Recommendations to increase your profile visibility to
                recruiters and optimize your LinkedIn settings.
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
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Client" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold text-gray-800">Jessica Patel</h3>
                  <p className="text-sm text-gray-600">Data Scientist</p>
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
                "After optimizing my LinkedIn profile, I started receiving 3x
                more recruiter messages. The headline and summary
                recommendations were spot on!"
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="Client" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold text-gray-800">Robert Kim</h3>
                  <p className="text-sm text-gray-600">Product Manager</p>
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
                "The LinkedIn optimization service helped me position myself as
                a thought leader in my industry. My content engagement has
                increased significantly."
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/women/22.jpg" alt="Client" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold text-gray-800">Emily Rodriguez</h3>
                  <p className="text-sm text-gray-600">Marketing Director</p>
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
                "I landed my dream job within a month of implementing the
                LinkedIn profile recommendations. The keyword optimization made
                all the difference!"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};