import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contextapi/AuthContext';
import NotFound from '../main/NotFound';
import Skills from './Skills';
import Certifications from './Certifications';
import Messages from './Messages';
import Projects from './Projects';
import UpdatePassword from './UpdatePassword';
import Dashboard from './Dashboard';


// Skeleton components for loading states - matching MainNavBar style
const SkeletonDashboard = () => (
  <div className="animate-pulse max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="h-8 bg-sky-200 rounded w-1/3 mb-6"></div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white/80 backdrop-blur-sm border border-sky-200/50 p-6 rounded-lg shadow-sm">
          <div className="h-12 bg-sky-200 rounded mb-4"></div>
          <div className="h-4 bg-sky-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-sky-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
    
    <div className="bg-white/80 backdrop-blur-sm border border-sky-200/50 p-6 rounded-lg shadow-sm">
      <div className="h-6 bg-sky-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-sky-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-sky-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-sky-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SkeletonSection = () => (
  <div className="animate-pulse max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="h-8 bg-sky-200 rounded w-2/4 mx-auto mb-8"></div>
    <div className="h-4 bg-sky-200 rounded w-2/3 mx-auto mb-12"></div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-sky-100 p-4 rounded-lg">
          <div className="h-40 bg-sky-200 rounded-lg w-full mb-4"></div>
          <div className="h-5 bg-sky-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-sky-200 rounded w-full"></div>
          <div className="h-4 bg-sky-200 rounded w-5/6 mt-2"></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonMessages = () => (
  <div className="animate-pulse max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="h-8 bg-sky-200 rounded w-1/4 mb-8"></div>
    
    <div className="bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-lg shadow-sm">
      <div className="p-6 border-b border-sky-200/50">
        <div className="h-6 bg-sky-200 rounded w-1/3"></div>
      </div>
      
      <div className="divide-y divide-sky-200/50">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-6 flex items-start space-x-4">
            <div className="w-10 h-10 bg-sky-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-sky-200 rounded w-32"></div>
                <div className="h-3 bg-sky-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-sky-200 rounded w-24"></div>
              <div className="h-4 bg-sky-200 rounded w-full"></div>
              <div className="h-4 bg-sky-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function AdminNavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Initial admin panel loading
  const [isNavigationLoading, setIsNavigationLoading] = useState(false); // Navigation loading
  const [loadedPage, setLoadedPage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { logout: authLogout, setIsAdminLoggedIn } = useAuth();

  // Quick action states for opening add modals
  const [quickActions, setQuickActions] = useState({
    openAddSkill: false,
    openAddProject: false,
    openAddCertification: false,
    openComposeMessage: false
  });

  // Reset quick actions when navigation changes
  useEffect(() => {
    setQuickActions({
      openAddSkill: false,
      openAddProject: false,
      openAddCertification: false,
      openComposeMessage: false
    });
  }, [location.pathname]);

  // Set loaded page on initial load
  useEffect(() => {
    setLoadedPage(location.pathname);
  }, []);

  // Simulate initial loading time for admin panel initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      setLoadedPage(location.pathname);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Enhanced navigation function with loading indicator - matching MainNavBar
  const handleNavigation = (path) => {
    if (location.pathname === path) return; // Don't reload if already on the page
    
    setIsNavigationLoading(true);
    
    // Close sidebar if open
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
    
    // Navigate immediately, but keep loading state
    navigate(path);
    
    // Simulate content loading delay
    setTimeout(() => {
      setLoadedPage(path); // Update loaded page after "content is ready"
      setIsNavigationLoading(false);
    }, 800); // Adjust timing as needed for realistic loading experience
  };

  // Function to determine which skeleton to show based on route
  const getSkeletonForRoute = (path) => {
    if (path === '/admin/messages') {
      return <SkeletonMessages />;
    } else if (path === '/' || path === '/admin/dashboard') {
      return <SkeletonDashboard />;
    } else {
      return <SkeletonSection />;
    }
  };

  // Quick action handlers
  const handleQuickAction = (action) => {
    const actionMap = {
      'add-skill': { path: '/admin/skills', action: 'openAddSkill' },
      'add-project': { path: '/admin/projects', action: 'openAddProject' },
      'add-certification': { path: '/admin/certifications', action: 'openAddCertification' },
      'compose-message': { path: '/admin/messages', action: 'openComposeMessage' }
    };

    const { path, action: actionType } = actionMap[action];
    
    if (location.pathname !== path) {
      // Navigate to the page first, then trigger the action
      setIsNavigationLoading(true);
      navigate(path);
      
      // Set the action to trigger after navigation
      setTimeout(() => {
        setQuickActions(prev => ({ ...prev, [actionType]: true }));
        setIsNavigationLoading(false);
        setLoadedPage(path);
      }, 800);
    } else {
      // Already on the correct page, trigger action immediately
      setQuickActions(prev => ({ ...prev, [actionType]: true }));
    }
  };

  // Reset quick action state
  const resetQuickAction = (actionType) => {
    setQuickActions(prev => ({ ...prev, [actionType]: false }));
  };
  
  const handleLogout = () => {
    if (typeof authLogout === 'function') {
      authLogout();
    }
    
    setIsAdminLoggedIn(false);
    navigate('/');
  };

  // Show initial loading screen while admin panel is initializing
  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-white via-sky-50 to-sky-100 flex h-screen">
        {/* Mobile Header Skeleton */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-sky-200/50 shadow-lg z-50">
          <div className="py-4 px-6 flex items-center justify-between">
            <div className="h-6 bg-sky-100 rounded w-32 animate-pulse"></div>
            <div className="w-6 h-6 bg-sky-100 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Desktop Sidebar Skeleton */}
        <div className="hidden md:block w-64 bg-white/80 backdrop-blur-sm border-r border-sky-200/50 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-sky-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg animate-pulse"></div>
              <div className="h-6 bg-sky-100 rounded w-32 animate-pulse"></div>
            </div>
          </div>

          <nav className="px-2 py-4 space-y-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center px-4 py-3 rounded-lg">
                <div className="w-5 h-5 bg-sky-100 rounded mr-3 animate-pulse"></div>
                <div className="h-4 bg-sky-100 rounded w-20 animate-pulse"></div>
              </div>
            ))}
            
            <div className="pt-6 border-t border-sky-200/50 mt-6">
              <div className="flex items-center px-4 py-3 rounded-lg">
                <div className="w-5 h-5 bg-sky-100 rounded mr-3 animate-pulse"></div>
                <div className="h-4 bg-sky-100 rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex items-center px-4 py-3 mt-2 rounded-lg">
                <div className="w-5 h-5 bg-sky-100 rounded mr-3 animate-pulse"></div>
                <div className="h-4 bg-sky-100 rounded w-28 animate-pulse"></div>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
          <header className="hidden md:block bg-white/80 backdrop-blur-sm border-b border-sky-200/50 shadow-sm">
            <div className="py-4 px-6 flex items-center justify-between">
              <div className="h-6 bg-sky-100 rounded w-32 animate-pulse"></div>
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-sky-100 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white via-sky-50 to-sky-100 p-6 relative">
            {/* Enhanced Loading Spinner - Same as MainNavBar */}
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-sky-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" 
                    role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                  <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-sky-200 opacity-30"></div>
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent animate-pulse">Loading Admin Panel...</div>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-sky-500 to-black rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-black to-sky-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-sky-600 to-black rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>

            <div className="animate-pulse">
              <div className="h-8 bg-sky-100 rounded w-1/3 mb-6"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm border border-sky-200/50 p-6 rounded-lg shadow-sm">
                    <div className="h-12 bg-sky-100 rounded mb-4"></div>
                    <div className="h-4 bg-sky-100 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-sky-100 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-sky-200/50 p-6 rounded-lg shadow-sm">
                <div className="h-6 bg-sky-100 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-sky-100 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-sky-100 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-sky-100 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-sky-200/50 shadow-lg z-50">
        <div className="py-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 via-sky-600 to-black rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">Admin Panel</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } fixed inset-y-0 right-0 z-50 w-64 bg-white/80 backdrop-blur-sm border-l border-sky-200/50 shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:right-auto md:left-0 md:border-r md:border-l-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-sky-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 via-sky-600 to-black rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">SL</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">Admin Panel</span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-md md:hidden text-gray-600 hover:bg-sky-50 hover:text-sky-600 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="px-2 py-4 space-y-1">
          <button 
            onClick={() => handleNavigation('/')}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-all duration-300 ${
              isActive('/') 
                ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white shadow-lg shadow-sky-200' 
                : 'text-gray-800 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-base font-bold">Dashboard</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/admin/skills')}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-all duration-300 ${
              isActive('/admin/skills') 
                ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white shadow-lg shadow-sky-200' 
                : 'text-gray-800 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-base font-bold">Skills</span>
          </button>

          <button 
            onClick={() => handleNavigation('/admin/projects')}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-all duration-300 ${
              isActive('/admin/projects') 
                ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white shadow-lg shadow-sky-200' 
                : 'text-gray-800 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-base font-bold">Projects</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/admin/certifications')}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-all duration-300 ${
              isActive('/admin/certifications') 
                ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white shadow-lg shadow-sky-200' 
                : 'text-gray-800 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span className="text-base font-bold">Certifications</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/admin/messages')}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-all duration-300 ${
              isActive('/admin/messages') 
                ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white shadow-lg shadow-sky-200' 
                : 'text-gray-800 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-base font-bold">Messages</span>
          </button>
          
          <button 
            onClick={() => handleNavigation('/admin/update-password')}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-all duration-300 ${
              isActive('/admin/update-password') 
                ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white shadow-lg shadow-sky-200' 
                : 'text-gray-800 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span className="text-base font-bold">Update Password</span>
          </button>

          <div className="pt-6 border-t border-sky-200/50 mt-6">
            <button 
              onClick={() => {
                handleLogout();
                closeSidebar();
              }}
              className="flex w-full items-center px-4 py-3 rounded-lg text-gray-800 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-base font-bold">Logout</span>
            </button>

            <Link 
              to="/"
              onClick={closeSidebar}
              className="flex items-center px-4 py-3 mt-2 rounded-lg text-gray-800 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-700 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-base font-bold">Back to Portfolio</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Enhanced Navigation Loading Spinner - Same as MainNavBar */}
      {isNavigationLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-sky-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" 
                role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-sky-200 opacity-30"></div>
            </div>
            <div className="text-lg font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent animate-pulse">Loading amazing content...</div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-gradient-to-r from-sky-500 to-black rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-black to-sky-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-sky-600 to-black rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
        {/* Desktop Top Header */}
        <header className="hidden md:block bg-white/80 backdrop-blur-sm border-b border-sky-200/50 shadow-sm z-10">
          <div className="py-4 px-6 flex items-center justify-between">
            <div className="text-xl font-semibold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">
              Admin Panel
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-gray-700">Welcome, <span className="text-sky-600 font-medium">Laxman</span></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white via-sky-50 to-sky-100 p-4 md:p-6">
          {isNavigationLoading ? (
            // Show appropriate skeleton based on where we're navigating to
            <div className="p-6">
              {getSkeletonForRoute(location.pathname)}
            </div>
          ) : (
            // Show the actual routes once loaded
            <Routes>
              <Route path="/admin/skills" element={<Skills />} />
              <Route path="/admin/projects" element={<Projects />} />
              <Route path="/admin/certifications" element={<Certifications />} />
              <Route path="/admin/messages" element={<Messages />} />
              <Route path="/admin/update-password" element={<UpdatePassword />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
}