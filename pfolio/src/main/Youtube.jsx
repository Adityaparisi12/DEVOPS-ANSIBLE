import React, { useState, useEffect } from 'react';

export default function Youtube() {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    // Simulate loading time for smooth entry animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
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
            <div className="h-16 bg-gradient-to-r from-sky-300/60 to-sky-400/60 rounded-2xl w-1/2 mx-auto mb-6 backdrop-blur-sm"></div>
            <div className="h-8 bg-gradient-to-r from-sky-200/50 to-sky-300/50 rounded-xl w-3/4 mx-auto mb-20 backdrop-blur-sm"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-sky-200/50 hover:shadow-xl transition-all duration-500">
                  <div className="h-16 bg-gradient-to-r from-sky-200 to-sky-300 rounded-xl mb-6"></div>
                  <div className="h-8 bg-sky-200/70 rounded-lg w-4/5 mb-4"></div>
                  <div className="h-6 bg-sky-100/80 rounded w-full mb-3"></div>
                  <div className="h-6 bg-sky-100/60 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gradient-to-r from-sky-400 to-sky-500 rounded-full w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const channelFeatures = [
    {
      title: "Full-Stack Development",
      description: "Complete web development tutorials from frontend React to backend Spring Boot with real deployment strategies",
      icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
      gradient: "from-sky-400 to-sky-600",
      stats: "Complete Stack"
    },
    {
      title: "Real-Time Projects",
      description: "Live coding sessions building actual projects that you can add to your portfolio and showcase to employers",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
      gradient: "from-black to-sky-700",
      stats: "Portfolio Ready"
    },
    {
      title: "DSA Made Simple",
      description: "Data Structures & Algorithms explained in the clearest way possible with real examples and interview preparation",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      gradient: "from-sky-500 to-black",
      stats: "Interview Ready"
    },
    {
      title: "Career Guidance",
      description: "Real career advice, interview preparation, resume building, and professional growth strategies for tech careers",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      gradient: "from-black to-sky-600",
      stats: "Professional Growth"
    },
    {
      title: "Portfolio Building",
      description: "Step-by-step guidance on creating impressive portfolios that get noticed by recruiters and land you interviews",
      icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z",
      gradient: "from-sky-600 to-black",
      stats: "Stand Out"
    },
    {
      title: "Personal Growth & Tech Talks",
      description: "Real stories, motivation, and practical insights. Especially for students from small towns chasing big dreams.",
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
      gradient: "from-sky-400 to-sky-700",
      stats: "Heart to Heart"
    }
  ];

  const channelStats = [
    { label: "Videos", value: "Growing", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
    { label: "LL Family", value: "Growing", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { label: "Categories", value: "6+", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" },
    { label: "Promise", value: "❤️ Clear", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-200 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced background elements with perfect sky-blue theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100/30 via-white/90 to-sky-300/40"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-sky-300/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-sky-100/10 to-sky-200/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Hero Section with perfect theme */}
        <div className="text-center mb-24">
          <div className="relative inline-block mb-8">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-black via-sky-600 to-black bg-clip-text text-transparent mb-6 tracking-tight">
              LL-Tech Talks
            </h1>
            {/* Enhanced glow effects */}
            <div className="absolute -inset-2 bg-gradient-to-r from-sky-400/30 via-sky-500/40 to-black/30 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-300/20 via-sky-600/30 to-black/20 rounded-xl blur-lg opacity-50"></div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-5xl mx-auto leading-relaxed font-medium">
            💡 <strong className="text-black">Welcome to LL-Tech Talks</strong> - where technology, learning, and real experience come together.
          </p>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-5xl mx-auto leading-relaxed">
            I'm <strong className="text-sky-700">Kothakota Sai Laxman Rao</strong>, also known as <strong className="text-sky-700">Laxman</strong>, and this channel is my way of giving back — by sharing what I've learned through experience, hard work, and countless hours of trial and error. Whether you're a beginner, a student from a small town, or someone looking to grow in tech — this is your platform.
          </p>

          {/* Enhanced Channel Access Button */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a
              href="https://www.youtube.com/@KOTHAKOTALAXMAN"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-bold text-lg rounded-2xl hover:from-red-700 hover:via-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/25"
            >
              <svg className="w-7 h-7 mr-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Visit LL-Tech Talks Channel
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 to-red-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
            </a>
            
            <div className="flex items-center space-x-3 text-sky-700 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-sky-200/50 shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <span className="text-sm font-semibold">Channel Live & Growing</span>
            </div>
          </div>

          {/* Enhanced Channel Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {channelStats.map((stat, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-md border border-sky-200/50 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-sky-400 to-sky-600 rounded-xl shadow-lg group-hover:from-sky-500 group-hover:to-sky-700 transition-all duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-black bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-sky-600 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Channel Features Grid */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-black via-sky-600 to-black bg-clip-text text-transparent mb-6">
            Channel Highlights
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto leading-relaxed">
            Discover what makes LL-Tech Talks your go-to destination for technology learning and career growth
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {channelFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`
                  relative bg-white/95 backdrop-blur-md border border-sky-200/50 rounded-2xl p-8 shadow-lg
                  transition-all duration-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/20
                  ${hoveredCard === index ? '-translate-y-4 shadow-2xl shadow-sky-500/25' : ''}
                `}>
                  {/* Enhanced Gradient Border Effect */}
                  <div className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    bg-gradient-to-r ${feature.gradient} p-[3px]
                  `}>
                    <div className="bg-white rounded-2xl h-full w-full"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Enhanced Icon */}
                    <div className={`
                      inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                      bg-gradient-to-r ${feature.gradient} text-white shadow-xl shadow-sky-500/30
                      transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
                    `}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={feature.icon} />
                      </svg>
                    </div>

                    {/* Enhanced Content */}
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-4 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-base leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Enhanced Stats Badge */}
                    <div className={`
                      inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white
                      bg-gradient-to-r ${feature.gradient} shadow-lg shadow-sky-500/25
                      group-hover:shadow-xl transition-all duration-300
                    `}>
                      {feature.stats}
                    </div>
                  </div>

                  {/* Enhanced Hover Effect Background */}
                  <div className={`
                    absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500
                    bg-gradient-to-br ${feature.gradient}
                  `}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Call to Action Section */}
        <div className="text-center">
          <div className="bg-white/95 backdrop-blur-md border border-sky-200/50 rounded-3xl p-12 md:p-16 shadow-2xl shadow-sky-500/10 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 right-10 w-32 h-32 bg-sky-200/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-sky-300/15 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-black via-sky-600 to-black bg-clip-text text-transparent mb-8">
                Join the LL-Tech Family! 🚀
              </h2>
              <p className="text-gray-600 mb-12 max-w-4xl mx-auto text-xl leading-relaxed">
                Ready to level up your tech journey? Subscribe to LL-Tech Talks and be part of a growing community 
                where we learn, grow, and succeed together. From complete beginners to career switchers - 
                we're here to support each other every step of the way!
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <a
                  href="https://www.youtube.com/@KOTHAKOTALAXMAN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/30"
                >
                  <svg className="w-7 h-7 mr-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Subscribe to LL-Tech Talks
                  <span className="ml-3 text-sm bg-white bg-opacity-25 px-3 py-1 rounded-full font-semibold">Free</span>
                </a>
                
                <a
                  href="https://www.youtube.com/@KOTHAKOTALAXMAN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-5 border-2 border-sky-500 text-sky-600 font-bold text-lg rounded-2xl hover:bg-sky-50 hover:border-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-8h6a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                  </svg>
                  Watch Content
                </a>
              </div>

              {/* Enhanced Additional Info */}
              <div className="mt-10 pt-8 border-t border-sky-200/50">
                <p className="text-base text-gray-500 font-medium">
                  🎯 Real-world projects • 💡 Clear explanations • 🤝 Community support • ❤️ From small towns to big dreams
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}