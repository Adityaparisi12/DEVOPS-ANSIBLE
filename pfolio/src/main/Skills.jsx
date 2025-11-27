import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import config from '../config';

export default function Skills() {
  const [skills, setSkills] = useState({});
  const [categories, setCategories] = useState(['Languages', 'Frontend', 'Backend', 'Databases', 'Tools & Others']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Languages');
  const [isVisible, setIsVisible] = useState({});

  // Professional learning resources
  const learningResources = [
    {
      name: "CodeChef",
      icon: "👨‍💻",
      url: "https://www.codechef.com/",
      gradient: "from-sky-500 via-sky-600 to-sky-700",
      description: "Competitive Programming Platform",
      features: ["Global Contests", "Practice Problems", "Community"]
    },
    {
      name: "HackerRank",
      icon: "🏆",
      url: "https://www.hackerrank.com/",
      gradient: "from-sky-500 via-sky-600 to-black",
      description: "Coding Challenges & Assessments",
      features: ["Skill Certification", "Interview Prep", "Domain Mastery"]
    },
    {
      name: "YouTube",
      icon: "📺",
      url: "https://www.youtube.com/",
      gradient: "from-black via-sky-600 to-sky-500",
      description: "Educational Video Content",
      features: ["Tech Tutorials", "Live Coding", "Expert Talks"]
    },
    {
      name: "Udemy",
      icon: "🎓",
      url: "https://www.udemy.com/",
      gradient: "from-gray-600 via-sky-600 to-black",
      description: "Professional Course Platform",
      features: ["Certified Courses", "Project-Based", "Industry Skills"]
    }
  ];

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
  }, [skills]);

  // Load skills from API
  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true);
        setError(null);

        const skillPromises = categories.map(async (category) => {
          try {
            const response = await axios.get(`${config.url}/skills/category/${category}`, {
              timeout: 5000,
              headers: {
                'Cache-Control': 'no-cache'
              }
            });
            return { category, data: response.data || [] };
          } catch (error) {
            console.error(`Error loading ${category} skills:`, error);
            return { category, data: [] };
          }
        });

        const results = await Promise.allSettled(skillPromises);
        const loadedSkills = {};

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            const { category, data } = result.value;
            loadedSkills[category] = data;
          }
        });

        setSkills(loadedSkills);
      } catch (err) {
        console.error('Error loading skills:', err);
        setError('Failed to load skills. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, [categories]);

  // Get professional category styling
  const getCategoryConfig = (category) => {
    const configs = {
      'Languages': { 
        gradient: 'from-sky-500 to-sky-700', 
        icon: '💻', 
        bg: 'from-sky-50 to-sky-100',
        description: 'Programming languages I work with'
      },
      'Frontend': { 
        gradient: 'from-sky-500 via-sky-600 to-black', 
        icon: '🎨', 
        bg: 'from-sky-50 to-gray-50',
        description: 'User interface and experience technologies'
      },
      'Backend': { 
        gradient: 'from-black via-sky-600 to-sky-500', 
        icon: '⚙️', 
        bg: 'from-gray-50 to-sky-50',
        description: 'Server-side development and APIs'
      },
      'Databases': { 
        gradient: 'from-sky-700 to-sky-500', 
        icon: '🗄️', 
        bg: 'from-sky-100 to-sky-50',
        description: 'Data storage and management systems'
      },
      'Tools & Others': { 
        gradient: 'from-gray-600 via-sky-600 to-black', 
        icon: '🛠️', 
        bg: 'from-gray-50 to-sky-50',
        description: 'Development tools and utilities'
      }
    };
    return configs[category] || configs['Languages'];
  };

  // Enhanced skill icon display
  const getSkillIcon = (skill) => {
    if (skill.iconUrl) {
      return (
        <div className="relative group">
          <img 
            src={skill.iconUrl} 
            alt={skill.skillname} 
            className="w-10 h-10 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 text-sky-600 flex items-center justify-center font-bold text-lg shadow-md">${(skill.skillname?.charAt(0) || '?').toUpperCase()}</div>`;
            }}
          />
        </div>
      );
    }
    
    return (
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 text-sky-600 flex items-center justify-center font-bold text-lg mx-auto mb-2 shadow-md">
        {(skill.skillname?.charAt(0) || '?').toUpperCase()}
      </div>
    );
  };

  // Memoized skill cards for better performance
  const SkillCard = useMemo(() => {
    return ({ skill, index }) => (
      <div 
        key={skill.id || index}
        className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 text-center border border-sky-100/50"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {getSkillIcon(skill)}
        
        <h3 className="font-semibold text-slate-800 group-hover:text-sky-600 transition-colors duration-300 text-sm">
          {skill.skillname}
        </h3>
        
        {skill.isLearning && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1 animate-pulse"></span>
              Learning
            </span>
          </div>
        )}
      </div>
    );
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots mx-auto mb-6">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading Skills</h2>
          <p className="text-slate-600">Fetching the latest data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 flex items-center justify-center">
        <div className="text-center bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-red-100/50 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Failed to Load Skills</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-gradient-to-r from-sky-500 to-sky-700 text-white rounded-lg hover:from-sky-600 hover:to-sky-800 transition-all duration-300 transform hover:scale-105"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100">
      {/* Professional Hero Section */}
      <div className="relative pt-12 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-sky-50/50 to-white/50"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-sky-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-black/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-sky-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div 
            data-animate 
            id="hero"
            className={`transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">
              Technical <span className="bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">Skills</span>
            </h1>
            
            <p className="max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed mb-6">
              Showcasing my expertise across various technologies, frameworks, and tools. 
              Each skill represents hours of learning, practice, and real-world application.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => {
                const config = getCategoryConfig(category);
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      activeCategory === category
                        ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                        : 'bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <span className="mr-2">{config.icon}</span>
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Active Category Display */}
        <div 
          data-animate 
          id={`category-${activeCategory}`}
          className={`transition-all duration-700 ${isVisible[`category-${activeCategory}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {(() => {
            const config = getCategoryConfig(activeCategory);
            return (
              <div className={`bg-gradient-to-br ${config.bg} rounded-3xl p-6 mb-12 shadow-xl border border-sky-100/50 backdrop-blur-sm`}>
                <div className="text-center mb-8">
                  <div className="text-4xl mb-3">{config.icon}</div>
                  <h2 className={`text-3xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-3`}>
                    {activeCategory}
                  </h2>
                  <p className="text-gray-700 text-base max-w-2xl mx-auto">
                    {config.description}
                  </p>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {skills[activeCategory] && skills[activeCategory].length > 0 ? (
                    skills[activeCategory].map((skill, index) => (
                      <SkillCard key={skill.id || `${activeCategory}-${index}`} skill={skill} index={index} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Skills Found</h3>
                      <p className="text-gray-500">No skills available for {activeCategory} category</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Professional Learning Resources */}
        <div 
          data-animate 
          id="resources"
          className={`transition-all duration-1000 ${isVisible.resources ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              Learning <span className="bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">Ecosystem</span>
            </h2>
            <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Platforms and resources that fuel my continuous learning journey and professional development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningResources.map((resource, index) => (
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                key={index}
                className="group block"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`bg-gradient-to-br ${resource.gradient} text-white rounded-2xl p-6 h-full shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-3 hover:scale-105 border border-white/20 backdrop-blur-sm`}>
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {resource.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{resource.name}</h3>
                    <div className="h-1 w-12 bg-white/50 mx-auto rounded-full group-hover:w-20 transition-all duration-300"></div>
                  </div>

                  {/* Description */}
                  <p className="text-white/90 text-center mb-4 font-medium text-sm">
                    {resource.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1 mb-4">
                    {resource.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-white/80 text-xs">
                        <div className="w-1 h-1 bg-white/60 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium transition-all duration-300 group-hover:bg-white group-hover:text-slate-800 border border-white/30">
                      Explore Platform
                      <svg className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Animations and styles */}
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
        
        /* Professional loading animation */
        .loading-dots {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }
        
        .loading-dots div {
          position: absolute;
          top: 33px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #0ea5e9;
          animation-timing-function: cubic-bezier(0, 1, 1, 0);
        }
        
        .loading-dots div:nth-child(1) {
          left: 8px;
          animation: dots1 0.6s infinite;
        }
        
        .loading-dots div:nth-child(2) {
          left: 8px;
          animation: dots2 0.6s infinite;
        }
        
        .loading-dots div:nth-child(3) {
          left: 32px;
          animation: dots2 0.6s infinite;
        }
        
        .loading-dots div:nth-child(4) {
          left: 56px;
          animation: dots3 0.6s infinite;
        }
        
        @keyframes dots1 {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        
        @keyframes dots3 {
          0% { transform: scale(1); }
          100% { transform: scale(0); }
        }
        
        @keyframes dots2 {
          0% { transform: translate(0, 0); }
          100% { transform: translate(24px, 0); }
        }
      `}</style>
    </div>
  );
}