import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { isHostedBackend } from '../utils/backendUtils';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [stats, setStats] = useState({
    skills: 0,
    certifications: 0,
    projects: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quick action handler to navigate and trigger add modals
  const handleQuickAction = (action) => {
    const actionMap = {
      'add-skill': '/admin/skills',
      'add-project': '/admin/projects',
      'add-certification': '/admin/certifications',
      'view-messages': '/admin/messages'
    };

    const path = actionMap[action];
    if (path) {
      // Navigate to the page with a special state to trigger the add modal
      navigate(path, { 
        state: { 
          triggerAction: action === 'view-messages' ? 'open' : 'add',
          fromDashboard: true 
        } 
      });
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real data from your backend APIs with extended timeout for hosted services
      const [skillsResponse, certificationsResponse, projectsResponse, messagesResponse] = await Promise.allSettled([
        axios.get(`${config.url}/skills/countskills`, { timeout: 30000 }),
        axios.get(`${config.url}/certifications/countcertifications`, { timeout: 30000 }),
        axios.get(`${config.url}/projects/countprojects`, { timeout: 30000 }),
        axios.get(`${config.url}/contacts/countmessages`, { timeout: 30000 })
      ]);

      const statsData = {
        skills: skillsResponse.status === 'fulfilled' ? skillsResponse.value.data : 0,
        certifications: certificationsResponse.status === 'fulfilled' ? certificationsResponse.value.data : 0,
        projects: projectsResponse.status === 'fulfilled' ? projectsResponse.value.data : 0,
        messages: messagesResponse.status === 'fulfilled' ? messagesResponse.value.data : 0
      };

      // Log any failed requests for debugging
      [skillsResponse, certificationsResponse, projectsResponse, messagesResponse].forEach((response, index) => {
        const endpoints = ['skills/countskills', 'certifications/countcertifications', 'projects/countprojects', 'contacts/countmessages'];
        if (response.status === 'rejected') {
          console.warn(`Failed to fetch ${endpoints[index]}:`, response.reason);
        }
      });

      setStats(statsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <div className={`${bgColor} backdrop-blur-sm border border-sky-200/50 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:shadow-sky-100/50 transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className={`text-2xl sm:text-3xl font-bold ${color}`}>
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              value
            )}
          </div>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-md`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl shadow-lg">
          {/* Header */}
          <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-sky-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-sky-500 via-sky-600 to-black rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm">Welcome back, Laxman!</p>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>

          {/* Hosted Backend Info Banner */}
          {isHostedBackend() && (
            <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded-r-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>Hosted Backend:</strong> Loading stats may take 30-60 seconds on first visit as the server starts up.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 rounded-r-md">
              <div className="flex justify-between items-start">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs sm:text-sm text-red-800">{error}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 touch-manipulation"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-6">
            {/* Stats Grid - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <StatCard
                title="Total Skills"
                value={stats.skills}
                color="text-sky-600"
                bgColor="bg-white/80"
                icon={
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              />
              
              <StatCard
                title="Certifications"
                value={stats.certifications}
                color="text-green-600"
                bgColor="bg-white/80"
                icon={
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                }
              />
              
              <StatCard
                title="Projects"
                value={stats.projects}
                color="text-purple-600"
                bgColor="bg-white/80"
                icon={
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
              />
              
              <StatCard
                title="Messages"
                value={stats.messages}
                color="text-orange-600"
                bgColor="bg-white/80"
                icon={
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>

            {/* Quick Actions - Mobile Responsive */}
            <div className="bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <button 
                  onClick={() => handleQuickAction('add-skill')}
                  className="p-3 sm:p-4 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-all duration-300 text-left group touch-manipulation"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sky-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-black text-sm sm:text-base">Add Skill</h4>
                      <p className="text-xs text-gray-600">Create new skill entry</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => handleQuickAction('add-project')}
                  className="p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-300 text-left group touch-manipulation"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-black text-sm sm:text-base">Add Project</h4>
                      <p className="text-xs text-gray-600">Upload new project</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => handleQuickAction('add-certification')}
                  className="p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-all duration-300 text-left group touch-manipulation"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-black text-sm sm:text-base">Add Certification</h4>
                      <p className="text-xs text-gray-600">Upload new certificate</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => handleQuickAction('view-messages')}
                  className="p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all duration-300 text-left group touch-manipulation"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-black text-sm sm:text-base">View Messages</h4>
                      <p className="text-xs text-gray-600">Check contact messages</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity - Mobile Responsive */}
            <div className="bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {loading ? (
                  // Loading skeleton
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-1 animate-pulse"></div>
                        <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-sky-200 bg-sky-50/50">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-black truncate">Updated React.js skill</p>
                        <p className="text-xs text-gray-600">Added new capabilities and experience</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">2 hrs ago</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-green-200 bg-green-50/50">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-black truncate">Added AWS certification</p>
                        <p className="text-xs text-gray-600">Solutions Architect Associate</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">1 day ago</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-purple-200 bg-purple-50/50">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-black truncate">Published new project</p>
                        <p className="text-xs text-gray-600">Portfolio website with React & Spring Boot</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">3 days ago</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
