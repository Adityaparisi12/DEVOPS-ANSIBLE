import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

export default function Contact() {
  const [isVisible, setIsVisible] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error and success messages when user starts typing
    if (error || success) {
      setError('');
      setSuccess(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Send data to backend API
      const response = await axios.post(
        `${config.url}/contacts/add`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;
        
        switch (status) {
          case 400:
            setError(message || 'Invalid data. Please check your input.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(message || 'Failed to send message. Please try again.');
        }
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other error
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100">
      {/* Professional Hero Section with animated blobs */}
      <div className="relative pt-12 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-sky-50/50 to-white/50"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-sky-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-black/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-sky-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div 
            data-animate 
            id="hero"
            className={`text-center mb-16 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Let's <span className="bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">Connect</span>
            </h1>
            <p className="max-w-3xl mx-auto text-gray-700 text-lg">
              Have a project in mind or just want to say hello? I'd love to hear from you! Fill
              out the form below or reach out through any of the provided contact
              methods.
            </p>
          </div>

          {/* Main Contact Section */}
          <div 
            data-animate 
            id="contact-form"
            className={`grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16 transition-all duration-1000 ${isVisible['contact-form'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* Left Column - Contact Info */}
            <div className="lg:col-span-2 bg-gradient-to-br from-sky-500 via-sky-600 to-black rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-600/40 p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Location</h3>
                    <p className="text-sky-100">Visakhapatnam, Andhra Pradesh, India</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-600/40 p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-sky-100">2300090230csit@gmail.com</p>
                  </div>
                </div>

                {/* Connect with me */}
                <div className="pt-6">
                  <h3 className="font-medium mb-4">Connect with me</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://github.com/2300090230/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-sky-600/40 p-3 rounded-full hover:bg-sky-600/60 transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sailaxmanrao-kothakota-2b0b1a1b6/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-sky-600/40 p-3 rounded-full hover:bg-sky-600/60 transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-200/50">
              <h2 className="text-2xl font-bold mb-6 text-black">Send me a message</h2>
              
              {/* Success Message */}
              {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-md">
                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Message Sent Successfully!</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Thank you for reaching out! I'll get back to you soon.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSuccess(false)}
                      className="text-green-400 hover:text-green-600"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setError('')}
                      className="text-red-400 hover:text-red-600"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Kothakota Ramesh"
                      className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ramesh@gmail.com"
                      className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Project Inquiry"
                    className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Tell me about your project or inquiry..."
                    className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white rounded-lg transition-all duration-300 font-medium transform shadow-lg ${
                    loading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:from-black hover:to-sky-600 hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 inline-block"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div 
            data-animate 
            id="faq-section"
            className={`mb-16 transition-all duration-1000 ${isVisible['faq-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked <span className="bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">Questions</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-sky-600 to-black mx-auto mb-4"></div>
              <p className="text-gray-700">
                Here are some common questions about my services and process.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {/* FAQ Item 1 */}
              <div className="rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-sky-200/50 shadow-lg">
                <details className="group">
                  <summary className="flex justify-between items-center p-5 cursor-pointer hover:bg-sky-50 transition-all duration-300">
                    <h3 className="text-base font-medium text-gray-800 flex items-center">
                      <span className="text-sky-600 mr-2">❓</span> What is your typical process for new projects?
                    </h3>
                    <span className="transform transition-transform duration-200 group-open:rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </summary>
                  <div className="p-5 bg-sky-50/50 text-gray-700 border-t border-sky-200/50">
                    <p className="mt-2 text-gray-600">
                      My approach starts with a detailed discussion to understand your project goals, target users, and features. I then move into:
                    </p>
                    <p className="mt-2 text-gray-600">
                      Planning & Architecture: Define the backend structure using Spring Boot and MySQL, and frontend layout using React with Tailwind CSS.
                    </p>
                    <p className="mt-2 text-gray-600">
                      Wireframing & UI/UX Design: Create basic wireframes or UI mockups based on the expected user flow.
                    </p>
                    <p className="mt-2 text-gray-600">
                      Development: Frontend with React + Vite, styled with Tailwind CSS and responsive design principles. Backend with RESTful API development using Spring Boot, secure authentication, and MySQL database integration.
                    </p>
                    <p className="mt-2 text-gray-600">
                      Testing & Deployment: Ensure everything works across devices and browsers, then deploy to services like Vercel, Netlify, Render or Railway.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ Item 2 */}
              <div className="rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-sky-200/50 shadow-lg">
                <details className="group">
                  <summary className="flex justify-between items-center p-5 cursor-pointer hover:bg-sky-50 transition-all duration-300">
                    <h3 className="text-base font-medium text-gray-800 flex items-center">
                      <span className="text-sky-600 mr-2">⏳</span> How long does it take to complete a typical project?
                    </h3>
                    <span className="transform transition-transform duration-200 group-open:rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </summary>
                  <div className="p-5 bg-sky-50/50 text-gray-700 border-t border-sky-200/50">
                    <p className="mt-2 text-gray-600">
                      Timelines depend on features and complexity:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-1">
                      <li>Portfolio/Static Website: 1–2 weeks</li>
                      <li>E-Commerce or Management System: 3–6 weeks</li>
                      <li>Full-Stack Applications (Admin + User Roles): 1.5–2.5 months</li>
                    </ul>
                    <p className="mt-2 text-gray-600">
                      Once I understand your exact requirements, I'll share a detailed timeline with milestones and delivery phases.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ Item 3 */}
              <div className="rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-sky-200/50 shadow-lg">
                <details className="group">
                  <summary className="flex justify-between items-center p-5 cursor-pointer hover:bg-sky-50 transition-all duration-300">
                    <h3 className="text-base font-medium text-gray-800 flex items-center">
                      <span className="text-sky-600 mr-2">🔧</span> Do you offer maintenance services after project completion?
                    </h3>
                    <span className="transform transition-transform duration-200 group-open:rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </summary>
                  <div className="p-5 bg-sky-50/50 text-gray-700 border-t border-sky-200/50">
                    <p className="mt-2 text-gray-600">
                      Yes, I provide post-deployment maintenance and updates like:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-1">
                      <li>Bug fixing</li>
                      <li>Feature enhancements</li>
                      <li>Backend optimizations</li>
                      <li>Frontend UI polishing</li>
                      <li>Security updates</li>
                    </ul>
                    <p className="mt-2 text-gray-600">
                      Maintenance packages can be hour-based, monthly, or per-feature, depending on your needs.
                    </p>
                  </div>
                </details>
              </div>

              {/* FAQ Item 4 */}
              <div className="rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-sky-200/50 shadow-lg">
                <details className="group">
                  <summary className="flex justify-between items-center p-5 cursor-pointer hover:bg-sky-50 transition-all duration-300">
                    <h3 className="text-base font-medium text-gray-800 flex items-center">
                      <span className="text-sky-600 mr-2">💰</span> What are your payment terms?
                    </h3>
                    <span className="transform transition-transform duration-200 group-open:rotate-180">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </summary>
                  <div className="p-5 bg-sky-50/50 text-gray-700 border-t border-sky-200/50">
                    <p className="mt-2 text-gray-600">
                      I usually follow this payment structure:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-1">
                      <li>30% upfront to initiate the project</li>
                      <li>40% mid-milestone (e.g., after backend or frontend completion)</li>
                      <li>30% on final delivery & deployment</li>
                    </ul>
                    <p className="mt-2 text-gray-600">
                      For long-term or larger projects, I also offer flexible installment-based payments. Everything is outlined transparently in a mutual agreement before work starts.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div 
            data-animate 
            id="location-section"
            className={`text-center mb-12 transition-all duration-1000 ${isVisible['location-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h2 className="text-3xl font-bold mb-4">
              My <span className="bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">Location</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-sky-600 to-black mx-auto mb-16"></div>

            <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl p-16 flex flex-col items-center relative overflow-hidden max-w-5xl mx-auto border border-sky-200/50 shadow-xl">
              <div className="relative z-10">
                <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white p-4 rounded-full mb-6 inline-block shadow-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-black">Located in Visakhapatnam, Andhra Pradesh</h3>
                <p className="text-gray-700">Available for remote work worldwide</p>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-5 left-5 w-24 h-24 bg-sky-300/30 rounded-full opacity-50"></div>
              <div className="absolute bottom-5 right-5 w-32 h-32 bg-black/10 rounded-full opacity-50"></div>
            </div>
          </div>

          {/* Professional Divider */}
          <div className="border-t-2 border-gradient-to-r from-sky-600 to-black mt-12 mb-8 w-full opacity-20"></div>

          {/* Footer Message */}
          <div 
            data-animate 
            id="footer-message"
            className={`text-center text-gray-700 transition-all duration-1000 ${isVisible['footer-message'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <p className="text-lg">Thank you for visiting my portfolio. I look forward to connecting with you!</p>
          </div>
        </div>
      </div>

      {/* Professional animations and blob effects */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}