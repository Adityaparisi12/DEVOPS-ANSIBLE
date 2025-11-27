import React, { useState, useEffect } from 'react';
import { Eye, Calendar, Github, Globe, X } from 'lucide-react';
import config from '../config';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  // Helper function to safely parse response
  const parseResponse = async (response) => {
    const text = await response.text();
    if (!text) {
      return null; // Empty response
    }
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse JSON:', text.substring(0, 100) + '...');
      throw new Error(`Invalid response from server: ${text.substring(0, 100)}...`);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${config.url}/projects/viewAll`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API endpoint not found. Please check if the backend server is running at ' + config.url);
        }
        throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
      }
      const data = await parseResponse(response);
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (project) => {
    setCurrentProject(project);
    setShowViewModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-200 p-4 relative overflow-hidden">
      {/* Enhanced background elements with perfect sky-blue theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100/30 via-white/90 to-sky-300/40"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-sky-300/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-sky-100/10 to-sky-200/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="bg-white/95 backdrop-blur-md border border-sky-200/50 rounded-2xl shadow-2xl shadow-sky-500/10 p-8 mb-8 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 right-4 w-20 h-20 bg-sky-200/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-sky-300/15 rounded-full blur-xl"></div>
          </div>
          
          <div className="text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-black via-sky-600 to-black bg-clip-text text-transparent mb-4">
              My Projects
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">Explore my portfolio of innovative projects and technical solutions</p>
          </div>
        </div>

        {/* Enhanced Error Message */}
        {error && (
          <div className="bg-white/95 backdrop-blur-md border border-red-200/50 rounded-2xl shadow-lg overflow-hidden mb-8" role="alert">
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Projects</h3>
                    <p className="text-red-700 leading-relaxed">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => setError('')}
                  className="flex-shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all duration-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Projects Loading */}
        {loading ? (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="w-20 h-20 mx-auto bg-white/95 backdrop-blur-md border border-sky-200/50 rounded-2xl flex items-center justify-center shadow-2xl shadow-sky-500/20">
                <div className="w-10 h-10 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin"></div>
              </div>
              {/* Animated pulse rings */}
              <div className="absolute inset-0 rounded-2xl border-2 border-sky-400/30 animate-ping"></div>
              <div className="absolute inset-2 rounded-xl border border-sky-300/20 animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-4">
              Loading Projects
            </h3>
            <p className="text-sky-600 font-medium">Discovering amazing projects...</p>
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-3 h-3 bg-gradient-to-r from-sky-500 to-black rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-black to-sky-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-sky-600 to-black rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="w-20 h-20 mx-auto bg-white/95 backdrop-blur-md border border-sky-200/50 rounded-2xl flex items-center justify-center shadow-2xl shadow-sky-500/20">
                <svg className="w-10 h-10 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-sky-400/30 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-sky-300/40 rounded-full animate-pulse delay-500"></div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-4">
              No Projects Found
            </h3>
            <p className="text-gray-600 text-lg">Check back later for exciting new projects!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white/98 backdrop-blur-md border border-sky-200/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-lg">
                {project.imgurl && (
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.imgurl} 
                      alt={project.title} 
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-1 group-hover:text-sky-700 transition-colors duration-300">{project.title}</h3>
                  <p className="text-gray-700 text-base mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
                  {project.category && (
                    <div className="text-sm mb-6">
                      <span className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-sky-500/25 transition-all duration-300">
                        {project.category}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleView(project)}
                        className="p-3 text-green-600 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-110 border border-green-200/50 bg-green-50/50"
                        title="View Project Details"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                    <div className="flex gap-3">
                      {project.gitlink && (
                        <a 
                          href={project.gitlink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-3 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-black rounded-xl hover:shadow-lg hover:shadow-gray-500/25 transition-all duration-300 transform hover:scale-110 border border-gray-200/50 bg-gray-50/50"
                          title="GitHub Repository"
                        >
                          <Github size={20} />
                        </a>
                      )}
                      {project.liveurl && (
                        <a 
                          href={project.liveurl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-3 text-sky-600 hover:text-white hover:bg-gradient-to-r hover:from-sky-500 hover:to-sky-600 rounded-xl hover:shadow-lg hover:shadow-sky-500/25 transition-all duration-300 transform hover:scale-110 border border-sky-200/50 bg-sky-50/50"
                          title="Live Demo"
                        >
                          <Globe size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced View Modal with Professional Theme */}
        {showViewModal && currentProject && (
          <div className="fixed inset-0 bg-gradient-to-br from-white/80 via-sky-50/90 to-sky-100/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white/98 backdrop-blur-xl border border-sky-200/50 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-sky-500/20 relative">
              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-8 right-8 w-32 h-32 bg-sky-200/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-8 left-8 w-40 h-40 bg-sky-300/10 rounded-full blur-2xl"></div>
              </div>
              
              <div className="p-8 md:p-12 relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-black via-sky-600 to-black bg-clip-text text-transparent">
                    Project Details
                  </h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-sky-500 hover:to-sky-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg border border-sky-200/50 backdrop-blur-sm bg-white/90"
                  >
                    <X size={28} />
                  </button>
                </div>

                <div className="space-y-8">{/* Content... */}
                  {currentProject.imgurl && (
                    <div className="rounded-2xl overflow-hidden shadow-2xl shadow-sky-500/20 relative group">
                      <img 
                        src={currentProject.imgurl} 
                        alt={currentProject.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  )}
                  
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-sky-200/50 shadow-lg">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">{currentProject.title}</h3>
                    {currentProject.category && (
                      <span className="inline-block bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white px-6 py-3 rounded-full text-base font-bold shadow-xl shadow-sky-500/25">
                        {currentProject.category}
                      </span>
                    )}
                  </div>

                  {currentProject.description && (
                    <div className="bg-gradient-to-r from-sky-50/95 to-sky-100/95 backdrop-blur-sm p-8 rounded-2xl border border-sky-200/50 shadow-lg">
                      <h4 className="font-bold text-xl text-sky-800 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        Description
                      </h4>
                      <p className="text-gray-800 text-lg leading-relaxed">{currentProject.description}</p>
                    </div>
                  )}

                  {currentProject.fdescription && (
                    <div className="bg-gradient-to-r from-sky-50/95 to-sky-100/95 backdrop-blur-sm p-8 rounded-2xl border border-sky-200/50 shadow-lg">
                      <h4 className="font-bold text-xl text-sky-800 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-sky-600 to-black rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </div>
                        Full Description
                      </h4>
                      <p className="text-gray-800 text-lg leading-relaxed">{currentProject.fdescription}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentProject.sdate && (
                      <div className="bg-gradient-to-r from-sky-50/95 to-sky-100/95 backdrop-blur-sm p-6 rounded-2xl border border-sky-200/50 shadow-lg">
                        <h4 className="font-bold text-lg text-sky-800 mb-3 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
                            <Calendar size={18} className="text-white" />
                          </div>
                          Start Date
                        </h4>
                        <p className="text-gray-800 text-lg font-medium">
                          {new Date(currentProject.sdate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {currentProject.edate && (
                      <div className="bg-gradient-to-r from-sky-50/95 to-sky-100/95 backdrop-blur-sm p-6 rounded-2xl border border-sky-200/50 shadow-lg">
                        <h4 className="font-bold text-lg text-sky-800 mb-3 flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-sky-600 to-black rounded-lg flex items-center justify-center">
                            <Calendar size={18} className="text-white" />
                          </div>
                          End Date
                        </h4>
                        <p className="text-gray-800 text-lg font-medium">
                          {new Date(currentProject.edate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {currentProject.technologies && (
                    <div className="bg-gradient-to-r from-sky-50/95 to-sky-100/95 backdrop-blur-sm p-8 rounded-2xl border border-sky-200/50 shadow-lg">
                      <h4 className="font-bold text-xl text-sky-800 mb-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-black to-sky-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        Technologies Used
                      </h4>
                      <p className="text-gray-800 text-lg leading-relaxed">{currentProject.technologies}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-6">
                    {currentProject.gitlink && (
                      <a
                        href={currentProject.gitlink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-600 to-black text-white rounded-2xl hover:from-black hover:to-gray-600 transition-all duration-300 shadow-2xl hover:shadow-gray-500/25 transform hover:scale-105 font-bold text-lg"
                      >
                        <Github size={24} />
                        GitHub Repository
                      </a>
                    )}
                    {currentProject.liveurl && (
                      <a
                        href={currentProject.liveurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 font-bold text-lg"
                      >
                        <Globe size={24} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
