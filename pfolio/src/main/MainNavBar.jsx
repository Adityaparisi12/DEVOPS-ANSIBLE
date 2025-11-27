import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Skills from './Skills';
import Footer from './Footer';
import Certifications from './Certifications';
import NotFound from './NotFound';
import Projects from './Projects';
import Contact from './Contact';
import Youtube from './Youtube';
import AdminLogin from '../admin/AdminLogin';

// Skeleton components for loading states
const SkeletonHome = () => (
  <div className="animate-pulse max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-6"></div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
      <div className="space-y-4">
        <div className="h-40 bg-gray-200 rounded-lg w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-10 bg-gray-200 rounded-lg w-1/3 mt-8"></div>
      </div>
    </div>
  </div>
);

const SkeletonSection = () => (
  <div className="animate-pulse max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="h-8 bg-gray-200 rounded w-2/4 mx-auto mb-8"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-gray-100 p-4 rounded-lg">
          <div className="h-40 bg-gray-200 rounded-lg w-full mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mt-2"></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonContact = () => (
  <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
    
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
      {/* Left Column */}
      <div className="lg:col-span-2 bg-gray-200 rounded-lg p-8 h-80"></div>
      
      {/* Right Column */}
      <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-8 border border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
          </div>
          
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
    
    {/* FAQ Section Skeleton */}
    <div className="mb-16">
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
      
      <div className="space-y-4 max-w-4xl mx-auto">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-14 bg-gray-200 rounded-lg w-full"></div>
        ))}
      </div>
    </div>
  </div>
);

export default function MainNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedPage, setLoadedPage] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const [sideNavCollapsed, setSideNavCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Set loaded page on initial load
  useEffect(() => {
    setLoadedPage(location.pathname);
  }, []);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSideNav = () => {
    setSideNavCollapsed(!sideNavCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Enhanced navigation items with professional icons and descriptions
  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      description: 'Welcome page',
      badge: null
    },
    { 
      path: '/about', 
      label: 'About', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      description: 'My story & journey',
      badge: null
    },
    { 
      path: '/skills', 
      label: 'Skills', 
      icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
      description: 'Technical expertise',
      badge: null
    },
    { 
      path: '/projects', 
      label: 'Projects', 
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      description: 'Portfolio showcase',
      badge: null
    },
    { 
      path: '/certifications', 
      label: 'Certifications', 
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      description: 'Achievements & awards',
      badge: 'New'
    },
    { 
      path: '/youtube', 
      label: 'YouTube', 
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      description: 'Video content & tutorials',
      badge: null
    },
    { 
      path: '/contact', 
      label: 'Contact', 
      icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      description: 'Get in touch',
      badge: null
    }
  ];

  // Function to handle navigation with loading indicator
  const handleNavigation = (path) => {
    if (location.pathname === path) return; // Don't reload if already on the page
    
    setIsLoading(true);
    
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // Navigate immediately, but keep loading state
    navigate(path);
    
    // Simulate content loading delay
    setTimeout(() => {
      setLoadedPage(path); // Update loaded page after "content is ready"
      setIsLoading(false);
    }, 800); // Adjust timing as needed for realistic loading experience
  };

  // Function to determine which skeleton to show based on route
  const getSkeletonForRoute = (path) => {
    if (path === '/contact') {
      return <SkeletonContact />;
    } else if (path === '/') {
      return <SkeletonHome />;
    } else if (path === '/youtube') {
      return <SkeletonSection />; // You can create a specific skeleton for YouTube if needed
    } else {
      return <SkeletonSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100">
      {/* Professional Side Navigation - Desktop */}
      <aside className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-xl border-r border-sky-200/50 shadow-2xl z-30 transition-all duration-300 ease-in-out hidden lg:flex flex-col ${
        sideNavCollapsed ? 'w-20' : 'w-72'
      }`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-sky-100/60">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 via-sky-600 to-black rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SL</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-sky-400 to-sky-500 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
              </div>
            </div>
            {!sideNavCollapsed && (
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-black bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent truncate">Sai Laxman</h1>
                <p className="text-base text-slate-800 font-semibold">Full Stack Developer</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                onMouseEnter={() => setActiveHover(index)}
                onMouseLeave={() => setActiveHover(null)}
                className={`
                  relative w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white shadow-lg transform scale-105 shadow-sky-200' 
                    : 'text-slate-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-700 hover:shadow-md hover:scale-105'
                  }
                  ${sideNavCollapsed ? 'justify-center' : ''}
                `}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 transition-transform duration-300 ${activeHover === index ? 'scale-110' : ''}`}>
                  <svg 
                    className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-sky-600'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>

                {/* Label and Description */}
                {!sideNavCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`font-bold text-base ${isActive ? 'text-white' : 'text-slate-900 group-hover:text-sky-700'}`}>
                      {item.label}
                    </p>
                    <p className={`text-sm mt-0.5 font-medium ${isActive ? 'text-sky-100' : 'text-slate-700 group-hover:text-sky-600'}`}>
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Badge */}
                {item.badge && !sideNavCollapsed && (
                  <span className="bg-gradient-to-r from-sky-500 to-black text-white text-xs px-2 py-1 rounded-full font-medium animate-bounce shadow-lg">
                    {item.badge}
                  </span>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-sky-300 to-black rounded-l-full shadow-lg"></div>
                )}

                {/* Tooltip for collapsed state */}
                {sideNavCollapsed && (
                  <div className="absolute left-full ml-6 px-3 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-xl">
                    {item.label}
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45"></div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle Button */}
        <div className="p-4 border-t border-sky-100/60">
          <button
            onClick={toggleSideNav}
            className="w-full flex items-center justify-center p-3 text-slate-500 hover:text-sky-600 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 rounded-xl transition-all duration-300 group"
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-300 ${sideNavCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-sky-200/50 shadow-lg z-40">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 via-sky-600 to-black rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">SL</span>
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">Sai Laxman</h1>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-slate-600 hover:text-sky-600 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 rounded-xl transition-all duration-300"
            >
              <svg 
                className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" onClick={toggleMobileMenu}>
            <div className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-white to-sky-50/30 shadow-2xl transform transition-transform duration-300 ease-in-out">
              <div className="p-6 border-b border-sky-100/60">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">Navigation</h2>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 text-slate-700 hover:text-slate-900 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <nav className="p-4 space-y-2">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white shadow-lg shadow-sky-200' 
                          : 'text-slate-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-700'
                        }
                      `}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <svg 
                        className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-500'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <div className="flex-1 text-left">
                        <p className={`font-bold text-base ${isActive ? 'text-white' : 'text-slate-900'}`}>
                          {item.label}
                        </p>
                        <p className={`text-sm font-medium ${isActive ? 'text-sky-100' : 'text-slate-700'}`}>
                          {item.description}
                        </p>
                      </div>
                      {item.badge && (
                        <span className="bg-gradient-to-r from-sky-500 to-black text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Loading Spinner */}
      {isLoading && (
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
      <main className={`transition-all duration-300 min-h-screen ${sideNavCollapsed ? 'lg:ml-20' : 'lg:ml-72'} lg:pt-0 pt-16`}>
        {isLoading ? (
          // Show appropriate skeleton based on where we're navigating to
          <div className="p-6">
            {getSkeletonForRoute(location.pathname)}
          </div>
        ) : (
          // Show the actual routes once loaded
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/youtube" element={<Youtube />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>

      <Footer />
    </div>
  );
}