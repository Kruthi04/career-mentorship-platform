import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, ArrowLeftIcon, CheckIcon, ClockIcon, StarIcon, CalendarIcon, VideoIcon, MessageSquareIcon, BookOpenIcon, ListIcon } from 'lucide-react';
export const InterviewPrep = () => {
  const [step, setStep] = useState(1);
  const [interviewType, setInterviewType] = useState('');
  const [industry, setIndustry] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [specificConcerns, setSpecificConcerns] = useState('');
  const [feedback, setFeedback] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const timeSlots = [{
    id: 1,
    day: 'Monday',
    date: 'June 10',
    slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']
  }, {
    id: 2,
    day: 'Tuesday',
    date: 'June 11',
    slots: ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM']
  }, {
    id: 3,
    day: 'Wednesday',
    date: 'June 12',
    slots: ['9:00 AM', '12:00 PM', '2:00 PM', '4:00 PM']
  }, {
    id: 4,
    day: 'Thursday',
    date: 'June 13',
    slots: ['11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM']
  }, {
    id: 5,
    day: 'Friday',
    date: 'June 14',
    slots: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM']
  }];
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
  const handleSlotSelect = (day, time) => {
    setSelectedSlot({
      day,
      time
    });
  };
  return <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-16">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" alt="Interview preparation" className="w-full h-full object-cover" />
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
              Interview Preparation Service
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Practice with industry experts to ace your upcoming interviews and
              land your dream job.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <ClockIcon size={18} className="mr-2" />
                <span>60-minute sessions</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <StarIcon size={18} className="mr-2" />
                <span>Industry-specific experts</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <VideoIcon size={18} className="mr-2" />
                <span>Video or phone sessions</span>
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
            {/* Step 1: Interview Details */}
            {step === 1 && <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Interview Details
                </h2>
                <p className="text-gray-600 mb-8">
                  Please provide details about your upcoming interview so we can
                  tailor the preparation session.
                </p>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="interviewType" className="block text-sm font-medium text-gray-700 mb-1">
                      Interview Type
                    </label>
                    <select id="interviewType" value={interviewType} onChange={e => setInterviewType(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                      <option value="">Select interview type</option>
                      <option value="behavioral">Behavioral Interview</option>
                      <option value="technical">Technical Interview</option>
                      <option value="case">Case Interview</option>
                      <option value="panel">Panel Interview</option>
                      <option value="phone">Phone/Screening Interview</option>
                      <option value="general">
                        General Interview Practice
                      </option>
                    </select>
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
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input type="text" id="jobTitle" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Software Engineer, Marketing Manager" required />
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <select id="experience" value={experience} onChange={e => setExperience(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                      <option value="">Select your experience level</option>
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="mid">Mid-Level (3-5 years)</option>
                      <option value="senior">Senior (6-10 years)</option>
                      <option value="executive">Executive (10+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="interviewDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Upcoming Interview Date (if scheduled)
                    </label>
                    <input type="date" id="interviewDate" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <Link to="/career-boost" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Cancel
                  </Link>
                  <button onClick={nextStep} disabled={!interviewType || !industry || !jobTitle || !experience} className={`px-6 py-2 rounded-md ${interviewType && industry && jobTitle && experience ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                    Next
                  </button>
                </div>
              </div>}
            {/* Step 2: Schedule Session */}
            {step === 2 && <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Schedule Your Mock Interview
                </h2>
                <p className="text-gray-600 mb-4">
                  Select a date and time for your 60-minute mock interview
                  session.
                </p>
                <div className="mb-6">
                  <label htmlFor="specificConcerns" className="block text-sm font-medium text-gray-700 mb-1">
                    Any specific concerns or areas you'd like to focus on?
                  </label>
                  <textarea id="specificConcerns" value={specificConcerns} onChange={e => setSpecificConcerns(e.target.value)} rows={4} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="E.g., I struggle with behavioral questions about conflict resolution, or I need help with system design questions."></textarea>
                </div>
                <div className="mt-8 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Available Time Slots
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {timeSlots.map(day => <div key={day.id} className="border border-gray-200 rounded-md overflow-hidden">
                        <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                          <p className="font-medium text-gray-800">{day.day}</p>
                          <p className="text-sm text-gray-600">{day.date}</p>
                        </div>
                        <div className="p-3 space-y-2">
                          {day.slots.map(time => <button key={time} onClick={() => handleSlotSelect(day, time)} className={`w-full py-2 px-3 text-sm rounded-md ${selectedSlot && selectedSlot.day.id === day.id && selectedSlot.time === time ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                              {time}
                            </button>)}
                        </div>
                      </div>)}
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Back
                  </button>
                  <button onClick={submitForm} disabled={!selectedSlot} className={`px-6 py-2 rounded-md ${selectedSlot ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                    Schedule Session
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
                    Interview Session Scheduled!
                  </h2>
                  <p className="text-gray-600">
                    Your mock interview session has been scheduled. You'll
                    receive a confirmation email with details and preparation
                    instructions.
                  </p>
                </div>
                {feedback && selectedSlot && <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                      Session Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CalendarIcon size={20} className="text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium">Date & Time</p>
                          <p className="text-gray-700">
                            {selectedSlot.day.day}, {selectedSlot.day.date} at{' '}
                            {selectedSlot.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <UserIcon size={20} className="text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium">Interview Type</p>
                          <p className="text-gray-700">
                            {interviewType} Interview for {jobTitle} position
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <VideoIcon size={20} className="text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium">Session Format</p>
                          <p className="text-gray-700">
                            Video call (link will be sent via email)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="font-medium text-blue-800 mb-2">
                        How to prepare:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>Review your resume and the job description</li>
                        <li>Prepare questions you'd like to practice</li>
                        <li>
                          Test your camera and microphone before the session
                        </li>
                        <li>Find a quiet place for the interview</li>
                      </ul>
                    </div>
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
            What's Included in Our Interview Preparation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <VideoIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                60-Minute Mock Interview
              </h3>
              <p className="text-gray-600">
                Realistic interview simulation with an industry expert who will
                ask relevant questions for your target role.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquareIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Personalized Feedback
              </h3>
              <p className="text-gray-600">
                Detailed feedback on your responses, communication style, body
                language, and areas for improvement.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ListIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Common Questions Prep
              </h3>
              <p className="text-gray-600">
                Practice answering the most common and challenging questions for
                your specific role and industry.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpenIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Follow-up Strategy
              </h3>
              <p className="text-gray-600">
                Guidance on post-interview follow-up, thank you notes, and how
                to address any weaknesses from the mock interview.
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
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Client" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold text-gray-800">Alex Johnson</h3>
                  <p className="text-sm text-gray-600">Software Developer</p>
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
                "The mock interview was incredibly realistic and helped me
                identify weaknesses in my responses. I felt much more confident
                in my actual interview and got the job!"
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Client" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold text-gray-800">Sarah Thompson</h3>
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
                "My interview coach provided specific feedback on how to
                structure my answers using the STAR method. This made a huge
                difference in my ability to showcase my achievements."
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Client" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold text-gray-800">James Wilson</h3>
                  <p className="text-sm text-gray-600">Financial Analyst</p>
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
                "After struggling with technical case interviews, the practice
                session helped me understand how to approach these questions
                methodically. I received an offer from my top choice firm!"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};