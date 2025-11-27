import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import laxman from '../ldocs/Laxman.png';
import resume from '../ldocs/LaxmanResume.pdf';
import config from '../config';

export default function About() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState({
    backend: [],
    frontend: [],
    languages: [],
    tools: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const axiosConfig = {
          timeout: 500,
          headers: {
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=60'
          }
        };

        const cacheKey = 'skills_cache';
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}_time`);
        
        if (cached && cacheTime && Date.now() - parseInt(cacheTime) < 30000) {
          setSkills(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const skillPromises = [
          axios.get(`${config.url}skills/backend`),
          axios.get(`${config.url}skills/frontend`),
          axios.get(`${config.url}skills/languages`),
          axios.get(`${config.url}skills/tools`)
        ];

        const results = await Promise.allSettled(skillPromises);
        
        const newSkills = {
          backend: results[0].status === 'fulfilled' ? results[0].value.data : [],
          frontend: results[1].status === 'fulfilled' ? results[1].value.data : [],
          languages: results[2].status === 'fulfilled' ? results[2].value.data : [],
          tools: results[3].status === 'fulfilled' ? results[3].value.data : []
        };

        setSkills(newSkills);
        localStorage.setItem(cacheKey, JSON.stringify(newSkills));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const AboutSkeleton = () => (
    <div className="py-8 sm:py-12 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div className="relative order-1 lg:order-1">
            <div className="bg-gray-200 rounded-2xl h-64 sm:h-80 lg:h-96 w-full animate-pulse"></div>
          </div>
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-2">
            <div className="space-y-3 lg:space-y-4">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 sm:h-8 bg-gray-200 rounded-full w-24 sm:w-32 animate-pulse"></div>
                <div className="h-6 sm:h-8 bg-gray-200 rounded-full w-20 sm:w-28 animate-pulse"></div>
              </div>
            </div>
            <div className="h-16 sm:h-20 lg:h-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="h-10 sm:h-12 bg-gray-200 rounded w-full sm:w-32 animate-pulse"></div>
              <div className="h-10 sm:h-12 bg-gray-200 rounded w-full sm:w-36 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const EducationSkeleton = () => (
    <div className="mb-12 lg:mb-20">
      <div className="h-8 sm:h-10 bg-gray-200 rounded w-1/3 mx-auto mb-8 lg:mb-16 animate-pulse"></div>
      <div className="bg-gray-100 rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-2xl shrink-0 animate-pulse mx-auto md:mx-0"></div>
          <div className="w-full space-y-3 lg:space-y-4 text-center md:text-left">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mx-auto md:mx-0 animate-pulse"></div>
            <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/3 mx-auto md:mx-0 animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center md:justify-start">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-6 sm:h-8 bg-gray-200 rounded-full w-20 sm:w-32 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const InterestsSkeleton = () => (
    <div className="mb-8 lg:mb-16">
      <div className="h-8 sm:h-10 bg-gray-200 rounded w-2/5 mx-auto mb-8 lg:mb-16 animate-pulse"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-3 sm:p-4 lg:p-6 rounded-xl">
            <div className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 bg-gray-200 rounded-full mx-auto mb-2 sm:mb-4 animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 relative overflow-x-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-sky-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-black/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-sky-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {loading ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-16">
          <AboutSkeleton />
          <EducationSkeleton />
          <InterestsSkeleton />
        </div>
      ) : (
        <div className="relative">
          {/* Hero Section */}
          <div className="py-8 sm:py-12 lg:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                {/* Image Section */}
                <div className="relative w-full max-w-xs sm:max-w-sm mx-auto lg:max-w-none lg:order-1">
                  <div className="relative bg-white rounded-2xl p-2 sm:p-4 shadow-xl border border-sky-200/50">
                    <img 
                      src={laxman} 
                      alt="Kothakota Sai Laxman Rao" 
                      className="w-full h-auto rounded-xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/500x600?text=Laxman";
                      }}
                    />
                  </div>
                  <div className="absolute top-1 right-1 sm:-top-4 sm:-right-4 bg-gradient-to-r from-sky-600 to-sky-700 text-white p-2 sm:p-3 rounded-lg shadow-lg">
                    <div className="text-sm sm:text-lg font-bold">4+</div>
                    <div className="text-xs">Years</div>
                  </div>
                  <div className="absolute bottom-1 left-1 sm:-bottom-4 sm:-left-4 bg-gradient-to-r from-sky-600 to-black text-white p-2 sm:p-3 rounded-lg shadow-lg">
                    <div className="text-sm sm:text-lg font-bold">10+</div>
                    <div className="text-xs">Projects</div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full mt-6 lg:mt-0 lg:order-2 text-center lg:text-left space-y-4 lg:space-y-6">
                  <div className="space-y-3">
                    <div className="inline-block px-4 py-2 bg-sky-100/90 text-sky-700 rounded-full text-sm font-semibold backdrop-blur-sm border border-sky-200/50">
                      👋 Hello, I'm
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-800 leading-tight">
                      <span className="bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">Sai Laxman</span> Rao
                    </h1>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      <span className="px-4 py-2 bg-sky-100/90 text-sky-700 rounded-full text-sm font-semibold backdrop-blur-sm border border-sky-200/50">
                        🚀 Full-Stack Developer
                      </span>
                      <span className="px-4 py-2 bg-gray-100/90 text-gray-800 rounded-full text-sm font-semibold backdrop-blur-sm border border-gray-200/50">
                        ⚡ Java & React Expert
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 lg:space-y-4">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed font-medium">
                      Hi, I'm <span className="text-sky-700 font-bold">Kothakota Sai Laxman Rao</span>, but you can call me Laxman — a passionate 
                      <span className="text-gray-900 font-bold"> Full-Stack Developer</span> with a strong foundation in Java (Spring Boot) and React.js. 
                      I specialize in building <span className="text-sky-700 font-bold">scalable web applications</span> with clean architecture.
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-800 leading-relaxed font-medium">
                      My journey in development is driven by <span className="text-gray-900 font-bold">curiosity and purpose</span>. I've built multiple projects, 
                      including eCommerce platforms like <span className="text-sky-700 font-bold">LL Cart</span> and
                      <span className="text-sky-700 font-bold"> GreenByte</span>.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <Link 
                      to="/contact" 
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all duration-300 font-bold text-center shadow-lg hover:shadow-sky-500/25 transform hover:scale-105"
                    >
                      Let's Connect
                    </Link>
                    <a 
                      href={resume} 
                      download
                      className="w-full sm:w-auto px-6 py-3 border border-sky-200/50 text-gray-800 rounded-lg hover:bg-sky-50 transition-all duration-300 font-bold text-center backdrop-blur-sm bg-white/90 shadow-lg hover:shadow-sky-500/25 transform hover:scale-105"
                    >
                      Download Resume
                    </a>
                  </div>
                  
                  <div className="flex gap-3 justify-center lg:justify-start pt-2">
                    <a href="https://github.com/2300090230/" target="_blank" rel="noopener noreferrer" 
                       className="p-3 bg-sky-100/90 text-sky-700 rounded-lg hover:bg-sky-200 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-sky-200/50 shadow-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/kothakota-sai-laxman-rao-0b1b6a1b2/" target="_blank" rel="noopener noreferrer"
                       className="p-3 bg-sky-100/90 text-sky-700 rounded-lg hover:bg-sky-200 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-sky-200/50 shadow-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Me Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-16">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-black text-gray-800 mb-3 sm:mb-4">
                About <span className="bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">Me</span>
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-sky-600 to-black mx-auto"></div>
            </div>

            <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0 lg:items-start">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-800">👨‍💻 About Me</h3>
                <div className="space-y-3 text-sm sm:text-base lg:text-base text-gray-800 leading-relaxed font-medium">
                  <p>
                    I'm someone who believes that <span className="text-sky-700 font-bold">consistency beats talent when talent doesn't show up</span>. 
                    For me, coding isn't just a skill — it's a form of <span className="text-gray-900 font-bold">expression, problem-solving, and impact</span>.
                  </p>
                  <p>
                    I'm currently mastering the art of writing <span className="text-sky-700 font-bold">clean, scalable code</span> while also exploring 
                    the balance between performance, usability, and maintainability.
                  </p>
                  <p>
                    What sets me apart isn't just my tech stack — it's my <span className="text-sky-700 font-bold">mindset</span>. 
                    I do everything with <span className="text-gray-900 font-bold">intention and discipline</span>.
                  </p>
                  <p className="text-sky-700 font-bold">
                    Let's turn ideas into reality — one meaningful commit at a time. 💡
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 lg:p-6 bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-lg hover:shadow-xl transition-all duration-300 group hover:border-sky-300/50 shadow-lg">
                  <div className="text-sky-600 text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">🎯</div>
                  <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">Problem Solver</h4>
                  <p className="text-gray-700 text-xs sm:text-sm font-medium">
                    Strong problem-solving using Python & C++ (DSA).
                  </p>
                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-lg hover:shadow-xl transition-all duration-300 group hover:border-sky-300/50 shadow-lg">
                  <div className="text-sky-600 text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">👨‍🏫</div>
                  <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">Teacher & Mentor</h4>
                  <p className="text-gray-700 text-xs sm:text-sm font-medium">
                    Teaching juniors and sharing knowledge.
                  </p>
                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-lg hover:shadow-xl transition-all duration-300 group hover:border-sky-300/50 shadow-lg">
                  <div className="text-sky-600 text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">🚀</div>
                  <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">Innovation</h4>
                  <p className="text-gray-700 text-xs sm:text-sm font-medium">
                    Exploring new technologies and solutions.
                  </p>
                </div>

                <div className="p-3 sm:p-4 lg:p-6 bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-lg hover:shadow-xl transition-all duration-300 group hover:border-sky-300/50 shadow-lg">
                  <div className="text-sky-600 text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">🎯</div>
                  <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">Discipline & Impact</h4>
                  <p className="text-gray-700 text-xs sm:text-sm font-medium">
                    Purpose-driven development with clarity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-16">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-800 mb-3 sm:mb-4">
                My <span className="bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">Tech Stack</span>
              </h3>
              <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-sky-600 to-black mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Frontend */}
              <div className="text-center p-4 sm:p-6 bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-lg hover:shadow-xl transition-all duration-300 group hover:border-sky-300/50 shadow-lg">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-sky-200 transition-colors">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">💻 Frontend</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  <div className="px-2 sm:px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs hover:bg-sky-200 transition-colors font-semibold">React.js</div>
                  <div className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs hover:bg-gray-200 transition-colors font-semibold">Vite</div>
                  <div className="px-2 sm:px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs hover:bg-sky-200 transition-colors font-semibold">Tailwind CSS</div>
                  <div className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs hover:bg-gray-200 transition-colors font-semibold">Bootstrap</div>
                </div>
              </div>

              {/* Backend */}
              <div className="text-center p-4 sm:p-6 bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-lg hover:shadow-xl transition-all duration-300 group hover:border-sky-300/50 shadow-lg">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-sky-200 transition-colors">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">🔧 Backend</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  <div className="px-2 sm:px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs hover:bg-sky-200 transition-colors font-semibold">Java</div>
                  <div className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs hover:bg-gray-200 transition-colors font-semibold">Spring Boot</div>
                  <div className="px-2 sm:px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs hover:bg-sky-200 transition-colors font-semibold">REST APIs</div>
                  <div className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs hover:bg-gray-200 transition-colors font-semibold">MySQL</div>
                </div>
              </div>

              {/* Tools */}
              <div className="text-center p-4 sm:p-6 bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-lg hover:shadow-xl transition-all duration-300 group hover:border-sky-300/50 sm:col-span-2 lg:col-span-1 shadow-lg">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-sky-200 transition-colors">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">🛠️ Tools</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  <div className="px-2 sm:px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs hover:bg-sky-200 transition-colors font-semibold">Postman</div>
                  <div className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs hover:bg-gray-200 transition-colors font-semibold">GitHub</div>
                  <div className="px-2 sm:px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs hover:bg-sky-200 transition-colors font-semibold">Cloudinary</div>
                  <div className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs hover:bg-gray-200 transition-colors font-semibold">Razorpay</div>
                </div>
              </div>
            </div>

            {/* Other Skills */}
            <div className="mt-6 sm:mt-8 bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 shadow-lg">
              <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 text-center">📚 Other Skills</h4>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-2 sm:px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs hover:bg-sky-200 transition-colors font-semibold">Python (DSA)</span>
                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs hover:bg-gray-200 transition-colors font-semibold">C++ (DSA)</span>
                <span className="px-2 sm:px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs hover:bg-sky-200 transition-colors font-semibold">Teaching</span>
                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs hover:bg-gray-200 transition-colors font-semibold">Mentoring</span>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-16">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-800 mb-3 sm:mb-4">
                My <span className="bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">Education</span>
              </h3>
              <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-sky-600 to-black mx-auto"></div>
            </div>

            <div className="bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-lg p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center md:items-start">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-800 mb-2 sm:mb-3">
                    Bachelor of Technology (CSE)
                  </h4>
                  <p className="text-sky-700 font-bold mb-3 sm:mb-4 text-sm sm:text-base">
                    KL University • 2021-2025
                  </p>
                  <p className="text-gray-800 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed font-medium">
                    Specialized in Computer Science and Engineering with focus on full-stack development, 
                    data structures, algorithms, and modern web technologies.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold">DSA</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Java</span>
                    <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold">Database</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Software Engineering</span>
                    <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold">Web Development</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Interests Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-16">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-800 mb-3 sm:mb-4">
                Personal <span className="bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">Interests</span>
              </h3>
              <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-sky-600 to-black mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {['🎵 Music', '📚 Reading', '🏃‍♂️ Fitness', '🎮 Gaming', '📸 Photo', '✈️ Travel', 
                '🍳 Cooking', '🎬 Movies', '🏏 Cricket', '🧩 Puzzles', '🌱 Garden', '💻 Coding'].map((interest, index) => (
                <div 
                  key={index} 
                  className="bg-white/95 backdrop-blur-sm border border-sky-200/50 p-3 sm:p-4 rounded-lg text-center hover:shadow-xl transition-all duration-300 group hover:border-sky-300/50 shadow-lg"
                >
                  <div className="text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    {interest.split(' ')[0]}
                  </div>
                  <p className="text-gray-800 text-xs sm:text-sm font-semibold">
                    {interest.split(' ').slice(1).join(' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800 mb-4 sm:mb-6">
              Let's Build Something <span className="bg-gradient-to-r from-sky-600 to-black bg-clip-text text-transparent">Meaningful</span> Together 🚀
            </h3>
            <p className="text-gray-800 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto font-medium">
              Ready to turn your ideas into reality? Let's collaborate and create exceptional digital experiences 
              that make a <span className="text-sky-700 font-bold">real impact</span>.
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
              <Link 
                to="/contact" 
                className="px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all duration-300 font-bold flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-sky-500/25 transform hover:scale-105"
              >
                <span>Start a Conversation</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a 
                href={resume} 
                download
                className="px-6 py-3 border border-sky-200/50 text-sky-700 rounded-lg hover:bg-sky-50 transition-all duration-300 font-bold flex items-center justify-center gap-2 text-sm sm:text-base backdrop-blur-sm bg-white/90 shadow-lg hover:shadow-sky-500/25 transform hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download Resume</span>
              </a>
            </div>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
}