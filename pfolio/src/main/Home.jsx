import React, { useState, useEffect } from 'react';
import laxman from '../ldocs/Laxamn.jpg';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    // Simulate loading time for smooth entry animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Rotating text animation
  const rotatingTexts = [
    "Full-Stack Developer",
    "React Specialist", 
    "Spring Boot Expert",
    "Problem Solver",
    "Tech Educator"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Loading skeleton with perfect sky-blue theme
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-200 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-white to-sky-300/30"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Left side skeleton */}
              <div className="space-y-8">
                <div className="h-8 bg-gradient-to-r from-sky-300/60 to-sky-400/60 rounded-xl w-1/3 backdrop-blur-sm"></div>
                <div className="h-20 bg-gradient-to-r from-sky-200/50 to-sky-300/50 rounded-2xl w-4/5 backdrop-blur-sm"></div>
                <div className="h-12 bg-gradient-to-r from-sky-300/40 to-sky-400/40 rounded-xl w-3/5 backdrop-blur-sm"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-sky-200/70 rounded w-full"></div>
                  <div className="h-6 bg-sky-200/50 rounded w-4/5"></div>
                  <div className="h-6 bg-sky-200/60 rounded w-3/4"></div>
                </div>
                <div className="flex space-x-4">
                  <div className="h-14 bg-gradient-to-r from-sky-400 to-sky-500 rounded-xl w-40"></div>
                  <div className="h-14 bg-white/90 border-2 border-sky-400 rounded-xl w-36"></div>
                </div>
              </div>
              
              {/* Right side skeleton */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-sky-300/60 to-sky-400/60 rounded-full backdrop-blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const skills = [
    { name: "React.js", level: 95, color: "from-sky-400 to-sky-600" },
    { name: "Spring Boot", level: 90, color: "from-black to-sky-700" },
    { name: "JavaScript", level: 92, color: "from-sky-500 to-black" },
    { name: "Java", level: 88, color: "from-black to-sky-600" },
    { name: "Node.js", level: 85, color: "from-sky-600 to-black" },
    { name: "Database", level: 87, color: "from-sky-400 to-sky-700" }
  ];

  const achievements = [
    { number: "50+", label: "Projects Completed", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { number: "3+", label: "Years Experience", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { number: "Growing", label: "YouTube Channel", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    { number: "100%", label: "Dedication", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-200 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100/30 via-white/90 to-sky-300/40"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-sky-300/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-sky-100/10 to-sky-200/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Left Content */}
              <div className="space-y-8 lg:pr-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm border border-sky-200/50 rounded-full shadow-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                    <span className="text-sky-700 font-semibold text-sm">Available for opportunities</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                    <span className="block text-black">Hi, I'm</span>
                    <span className="block bg-gradient-to-r from-black via-sky-600 to-black bg-clip-text text-transparent">
                      Laxman
                    </span>
                  </h1>
                  
                  <div className="h-16 md:h-20">
                    <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">
                      {rotatingTexts[currentText]}
                    </h2>
                  </div>
                </div>

                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Passionate full-stack developer from a small town with big dreams. I create modern web applications 
                  using <span className="font-semibold text-sky-700">React</span>, <span className="font-semibold text-sky-700">Spring Boot</span>, and 
                  share my journey through <span className="font-semibold text-sky-700">LL-Tech Talks</span> on YouTube.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="contact"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-sky-500 to-sky-700 text-white font-bold text-lg rounded-2xl hover:from-sky-600 hover:to-sky-800 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-sky-500/25"
                  >
                    Get In Touch
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  
                  <a
                    href="projects"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-sky-500 text-sky-600 font-bold text-lg rounded-2xl hover:bg-sky-50 hover:border-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    View Projects
                  </a>
                </div>

                {/* Social Links */}
                <div className="flex space-x-6">
                  <a href="https://www.youtube.com/@KOTHAKOTALAXMAN" target="_blank" rel="noopener noreferrer" 
                     className="group p-3 bg-white/90 backdrop-blur-sm border border-sky-200/50 rounded-xl shadow-lg hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-110">
                    <svg className="w-6 h-6 text-red-600 group-hover:text-red-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  
                  <a href="#" className="group p-3 bg-white/90 backdrop-blur-sm border border-sky-200/50 rounded-xl shadow-lg hover:shadow-xl hover:shadow-sky-500/20 transition-all duration-300 transform hover:scale-110">
                    <svg className="w-6 h-6 text-sky-600 group-hover:text-sky-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  
                  <a href="#" className="group p-3 bg-white/90 backdrop-blur-sm border border-sky-200/50 rounded-xl shadow-lg hover:shadow-xl hover:shadow-gray-500/20 transition-all duration-300 transform hover:scale-110">
                    <svg className="w-6 h-6 text-gray-800 group-hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Right Content - Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  {/* Background decoration */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-sky-400/30 to-sky-600/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-sky-300/20 to-sky-700/20 rounded-full blur-xl"></div>
                  
                  {/* Main image container */}
                  <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/80 shadow-2xl shadow-sky-500/20 group-hover:shadow-sky-500/30 transition-all duration-500">
                    <img 
                      src={laxman} 
                      alt="Laxman - Full Stack Developer" 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Floating badges */}
                  <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-xl px-3 py-2 shadow-lg">
                    <span className="text-sm font-bold text-sky-700">Available</span>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-xl px-3 py-2 shadow-lg">
                    <span className="text-sm font-bold text-gray-700">Full-Stack Dev</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-black via-sky-600 to-black bg-clip-text text-transparent mb-6">
                Technical Skills
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Proficient in modern technologies with a focus on creating scalable and efficient solutions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="group bg-white/95 backdrop-blur-md border border-sky-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:shadow-sky-500/20 transition-all duration-500 transform hover:scale-105"
                  onMouseEnter={() => setHoveredSkill(index)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{skill.name}</h3>
                    <span className="text-lg font-bold bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">
                      {skill.level}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                      style={{ 
                        width: hoveredSkill === index ? `${skill.level}%` : '0%' 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-black via-sky-600 to-black bg-clip-text text-transparent mb-6">
                Achievements
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="group text-center">
                  <div className="bg-white/95 backdrop-blur-md border border-sky-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:shadow-sky-500/20 transition-all duration-500 transform hover:scale-105">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-gradient-to-r from-sky-400 to-sky-600 rounded-xl shadow-lg group-hover:from-sky-500 group-hover:to-sky-700 transition-all duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={achievement.icon} />
                        </svg>
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-2">
                      {achievement.number}
                    </div>
                    <div className="text-sm font-semibold text-sky-600 uppercase tracking-wide">
                      {achievement.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/95 backdrop-blur-md border border-sky-200/50 rounded-3xl p-12 shadow-2xl shadow-sky-500/10 relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 right-10 w-32 h-32 bg-sky-200/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-sky-300/15 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-black via-sky-600 to-black bg-clip-text text-transparent mb-6">
                  Ready to Work Together?
                </h2>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                  Let's build something amazing together. I'm always excited to work on new projects and collaborate with fellow developers.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <a
                    href="contact"
                    className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-sky-500 to-sky-700 text-white font-bold text-lg rounded-2xl hover:from-sky-600 hover:to-sky-800 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-sky-500/30"
                  >
                    Start a Project
                    <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  
                  <a
                    href="https://www.youtube.com/@KOTHAKOTALAXMAN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-10 py-5 border-2 border-sky-500 text-sky-600 font-bold text-lg rounded-2xl hover:bg-sky-50 hover:border-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Watch LL-Tech Talks
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
