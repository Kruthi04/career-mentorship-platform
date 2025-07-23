import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, ArrowLeftIcon, ClockIcon, StarIcon, BriefcaseIcon, SearchIcon, UsersIcon, BuildingIcon, UploadIcon, FileTextIcon, EyeIcon } from 'lucide-react';
export const GetReferral = () => {
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [industry, setIndustry] = useState('');
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState('');
  const [coverLetter, setCoverLetter] = useState(null);
  const [coverLetterPreview, setCoverLetterPreview] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [feedback, setFeedback] = useState(false);
  const handleResumeChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setResume(selectedFile);
      // Create a preview URL for PDF if possible
      if (selectedFile.type === 'application/pdf') {
        const fileUrl = URL.createObjectURL(selectedFile);
        setResumePreview(fileUrl);
      }
    }
  };
  const handleCoverLetterChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setCoverLetter(selectedFile);
      // Create a preview URL for PDF if possible
      if (selectedFile.type === 'application/pdf') {
        const fileUrl = URL.createObjectURL(selectedFile);
        setCoverLetterPreview(fileUrl);
      }
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
  const companies = [{
    id: 1,
    name: 'Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png',
    available: true
  }, {
    id: 2,
    name: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png',
    available: true
  }, {
    id: 3,
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png',
    available: true
  }, {
    id: 4,
    name: 'Apple',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png',
    available: true
  }, {
    id: 5,
    name: 'Facebook',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png',
    available: true
  }, {
    id: 6,
    name: 'Netflix',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png',
    available: true
  }, {
    id: 7,
    name: 'Salesforce',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/1200px-Salesforce.com_logo.svg.png',
    available: true
  }, {
    id: 8,
    name: 'Adobe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/1200px-Adobe_Systems_logo_and_wordmark.svg.png',
    available: true
  }];
  return <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-16">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" alt="Business networking" className="w-full h-full object-cover" />
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
            <h1 className="text-4xl font-bold mb-4">Get a Referral Service</h1>
            <p className="text-xl text-blue-100 mb-6">
              Connect with professionals who can refer you to their companies
              and increase your chances of getting an interview.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <ClockIcon size={18} className="mr-2" />
                <span>Fast-track applications</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <StarIcon size={18} className="mr-2" />
                <span>Internal referrals</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full">
                <CheckIcon size={18} className="mr-2" />
                <span>Application review</span>
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
            {/* Step 1: Target Company */}
            {step === 1 && <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Select Target Company
                </h2>
                <p className="text-gray-600 mb-8">
                  Choose the company where you'd like to get referred. We have
                  connections at many top companies.
                </p>
                <div className="mb-6">
                  <label htmlFor="companySearch" className="block text-sm font-medium text-gray-700 mb-2">
                    Search for a company
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="text" id="companySearch" className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Type company name..." onChange={e => setCompany(e.target.value)} />
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Popular Companies with Available Referrals
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {companies.map(company => <div key={company.id} onClick={() => setCompany(company.name)} className={`border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${company.name === company ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'}`}>
                        <img src={company.logo} alt={company.name} className="h-12 mb-3 object-contain" />
                        <p className="text-sm font-medium text-gray-800">
                          {company.name}
                        </p>
                        {company.available && <span className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Available
                          </span>}
                      </div>)}
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                      Position You're Applying For
                    </label>
                    <input type="text" id="position" value={position} onChange={e => setPosition(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Software Engineer, Marketing Manager" required />
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
                </div>
                <div className="flex justify-between mt-8">
                  <Link to="/career-boost" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Cancel
                  </Link>
                  <button onClick={nextStep} disabled={!company || !position || !industry} className={`px-6 py-2 rounded-md ${company && position && industry ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                    Next
                  </button>
                </div>
              </div>}
            {/* Step 2: Upload Materials */}
            {step === 2 && <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Upload Application Materials
                </h2>
                <p className="text-gray-600 mb-8">
                  Please upload your resume, cover letter, and provide your
                  LinkedIn profile. We'll review these before connecting you
                  with a referrer.
                </p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {resumePreview ? <div className="flex flex-col items-center">
                            <FileTextIcon className="mx-auto h-12 w-12 text-blue-500" />
                            <p className="text-sm text-gray-700 mt-2">
                              {resume.name}
                            </p>
                            <div className="flex mt-4 space-x-2">
                              <a href={resumePreview} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-sm text-blue-700 border border-blue-700 rounded-md hover:bg-blue-50 flex items-center">
                                <EyeIcon size={14} className="mr-1" />
                                Preview
                              </a>
                              <button onClick={() => {
                          setResume(null);
                          setResumePreview('');
                        }} className="px-3 py-1 text-sm text-red-700 border border-red-700 rounded-md hover:bg-red-50">
                                Remove
                              </button>
                            </div>
                          </div> : <>
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="resume-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="resume-upload" name="resume-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, DOC, or DOCX up to 10MB
                            </p>
                          </>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {coverLetterPreview ? <div className="flex flex-col items-center">
                            <FileTextIcon className="mx-auto h-12 w-12 text-blue-500" />
                            <p className="text-sm text-gray-700 mt-2">
                              {coverLetter.name}
                            </p>
                            <div className="flex mt-4 space-x-2">
                              <a href={coverLetterPreview} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-sm text-blue-700 border border-blue-700 rounded-md hover:bg-blue-50 flex items-center">
                                <EyeIcon size={14} className="mr-1" />
                                Preview
                              </a>
                              <button onClick={() => {
                          setCoverLetter(null);
                          setCoverLetterPreview('');
                        }} className="px-3 py-1 text-sm text-red-700 border border-red-700 rounded-md hover:bg-red-50">
                                Remove
                              </button>
                            </div>
                          </div> : <>
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="cover-letter-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="cover-letter-upload" name="cover-letter-upload" type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={handleCoverLetterChange} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, DOC, or DOCX up to 10MB
                            </p>
                          </>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="linkedInUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn Profile URL
                    </label>
                    <input type="url" id="linkedInUrl" value={linkedInUrl} onChange={e => setLinkedInUrl(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://www.linkedin.com/in/yourname" required />
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={prevStep} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Back
                  </button>
                  <button onClick={submitForm} disabled={!resume || !linkedInUrl} className={`px-6 py-2 rounded-md ${resume && linkedInUrl ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
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
                    Application Submitted Successfully!
                  </h2>
                  <p className="text-gray-600">
                    Thank you for submitting your application. Our team will
                    review your materials and match you with a professional at{' '}
                    {company} for a referral.
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
                          Our team will review your resume and application
                          materials (1-2 business days)
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-blue-800">
                          2
                        </span>
                        <p>
                          We'll match you with a professional at {company} who
                          can provide a referral
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-blue-800">
                          3
                        </span>
                        <p>
                          You'll receive an email introduction to your referrer
                          and guidance on next steps
                        </p>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5 text-blue-800">
                          4
                        </span>
                        <p>
                          Your referrer will submit your application through the
                          company's internal referral system
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
            Benefits of Getting a Referral
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BuildingIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Direct Access
              </h3>
              <p className="text-gray-600">
                Bypass the standard application process and get your resume
                directly in front of hiring managers.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BriefcaseIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Higher Success Rate
              </h3>
              <p className="text-gray-600">
                Referred candidates are 15x more likely to be hired than
                candidates who apply through job boards.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileTextIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Application Review
              </h3>
              <p className="text-gray-600">
                Get your resume and cover letter reviewed before submission to
                ensure they meet the company's standards.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <UsersIcon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Insider Knowledge
              </h3>
              <p className="text-gray-600">
                Gain valuable insights about the company culture, interview
                process, and what the hiring team looks for.
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
                <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="Client" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold text-gray-800">Robert Kim</h3>
                  <p className="text-sm text-gray-600">
                    Software Engineer at Google
                  </p>
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
                "After applying to Google for months with no response, I got a
                referral through this service. I had an interview within a week
                and received an offer shortly after!"
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/women/22.jpg" alt="Client" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold text-gray-800">Emily Rodriguez</h3>
                  <p className="text-sm text-gray-600">
                    Product Manager at Microsoft
                  </p>
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
                "The referral service was a game-changer. My application was
                fast-tracked, and I got valuable insider tips about the
                interview process that helped me prepare."
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Client" className="w-12 h-12 rounded-full object-cover mr-4" />
                <div>
                  <h3 className="font-bold text-gray-800">Michael Chen</h3>
                  <p className="text-sm text-gray-600">
                    Data Scientist at Amazon
                  </p>
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
                "The feedback on my resume before submission was invaluable. The
                referrer also provided great insights about the team and role
                that helped me ace the interviews."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};