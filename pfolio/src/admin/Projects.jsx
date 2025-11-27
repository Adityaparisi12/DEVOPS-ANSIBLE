import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, X, Calendar, Github, Globe } from 'lucide-react';
import config from '../config';

const Projects = ({ openAddModal = false, onResetQuickAction }) => {
  const location = useLocation();
  
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fdescription: '',
    category: '',
    sdate: '',
    edate: '',
    technologies: '',
    gitlink: '',
    liveurl: '',
    imgurl: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle quick action from Dashboard or AdminNavBar
  useEffect(() => {
    if (openAddModal || (location.state?.triggerAction === 'add' && location.state?.fromDashboard)) {
      handleAdd();
      if (onResetQuickAction) {
        onResetQuickAction();
      }
      // Clear the navigation state after using it
      if (location.state?.fromDashboard) {
        window.history.replaceState({}, document.title);
      }
    }
  }, [openAddModal, onResetQuickAction, location.state]);

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

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fdescription: '',
      category: '',
      sdate: '',
      edate: '',
      technologies: '',
      gitlink: '',
      liveurl: '',
      imgurl: ''
    });
    setImageFile(null);
    setEditMode(false);
    setCurrentProject(null);
    setError('');
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title || '',
      description: project.description || '',
      fdescription: project.fdescription || '',
      category: project.category || '',
      sdate: project.sdate ? new Date(project.sdate).toISOString().split('T')[0] : '',
      edate: project.edate ? new Date(project.edate).toISOString().split('T')[0] : '',
      technologies: project.technologies || '',
      gitlink: project.gitlink || '',
      liveurl: project.liveurl || '',
      imgurl: project.imgurl || ''
    });
    setCurrentProject(project);
    setEditMode(true);
    setShowModal(true);
  };

  const handleView = (project) => {
    setCurrentProject(project);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${config.url}/projects/del/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Project not found or API endpoint unavailable.');
        }
        throw new Error(`Failed to delete project: ${response.status} ${response.statusText}`);
      }
      
      // DELETE requests may return no content
      try {
        await parseResponse(response);
      } catch (parseError) {
        console.log('Delete successful, no JSON response received');
      }
      
      fetchProjects();
      alert('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editMode) {
        // For UPDATE: Send as JSON (no multipart, matches @RequestBody)
        const projectData = {
          ...formData,
          sdate: formData.sdate ? formData.sdate : null,
          edate: formData.edate ? formData.edate : null
        };

        const response = await fetch(`${config.url}/projects/update/${currentProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        });

        if (!response.ok) {
          let errorMessage = `Failed to update project: ${response.status} ${response.statusText}`;
          try {
            const errorData = await parseResponse(response);
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            // Use default error message if parsing fails
          }
          throw new Error(errorMessage);
        }

        try {
          await parseResponse(response);
        } catch (parseError) {
          console.log('Update successful, no valid JSON response received');
        }

      } else {
        // For ADD: Send as multipart with project JSON part + image part
        const formDataToSend = new FormData();
        
        // Create project object as JSON
        const projectData = {
          title: formData.title,
          description: formData.description,
          fdescription: formData.fdescription,
          category: formData.category,
          technologies: formData.technologies,
          gitlink: formData.gitlink || '',
          liveurl: formData.liveurl || '',
          sdate: formData.sdate ? formData.sdate : null,
          edate: formData.edate ? formData.edate : null
        };
        
        // Add project as JSON blob with correct content type
        const projectBlob = new Blob([JSON.stringify(projectData)], {
          type: 'application/json'
        });
        formDataToSend.append('project', projectBlob);
        
        // Add image file if selected in "image" part
        if (imageFile && imageFile.size > 0) {
          formDataToSend.append('image', imageFile);
        }

        const response = await fetch(`${config.url}/projects/add`, {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          let errorMessage = `Failed to add project: ${response.status} ${response.statusText}`;
          if (response.status === 415) {
            errorMessage = 'Unsupported media type. Please ensure the backend supports multipart/form-data.';
          } else if (response.status === 404) {
            errorMessage = 'API endpoint not found. Please check if the backend server is running at ' + config.url;
          }
          try {
            const errorData = await parseResponse(response);
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            // Use default error message if parsing fails
          }
          throw new Error(errorMessage);
        }

        try {
          await parseResponse(response);
        } catch (parseError) {
          console.log('Add successful, no valid JSON response received');
        }
      }

      setShowModal(false);
      resetForm();
      fetchProjects();
      alert(`Project ${editMode ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error('Error saving project:', error);
      setError(`Failed to ${editMode ? 'update' : 'add'} project: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // Limit to 5MB
      setError('Image file size must be less than 5MB');
      setImageFile(null);
      return;
    }
    setImageFile(file);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">
                Projects Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">Manage your portfolio projects</p>
            </div>
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-sky-500 via-sky-600 to-black hover:from-sky-600 hover:via-sky-700 hover:to-gray-900 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Project</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl relative mb-6 shadow-sm" role="alert">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-500 hover:text-red-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {loading && !showModal ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-8 h-8 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin"></div>
            </div>
            <p className="text-sky-600 font-medium">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-2">
              No projects found
            </h3>
            <p className="text-gray-600">Add your first project to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {project.imgurl && (
                  <img 
                    src={project.imgurl} 
                    alt={project.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                  {project.category && (
                    <div className="text-xs text-gray-500 mb-4">
                      <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-medium">{project.category}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(project)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300"
                        title="View Project"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-all duration-300"
                        title="Edit Project"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {project.gitlink && (
                        <a 
                          href={project.gitlink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-300"
                          title="GitHub Repository"
                        >
                          <Github size={16} />
                        </a>
                      )}
                      {project.liveurl && (
                        <a 
                          href={project.liveurl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-300"
                          title="Live Demo"
                        >
                          <Globe size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm border border-sky-200/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-sky-200/50 px-6 py-4 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">
                    {editMode ? 'Edit Project' : 'Add New Project'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl relative shadow-sm" role="alert">
                      <span className="block sm:inline">{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
                          placeholder="Enter project title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <input
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
                          placeholder="e.g., Web Development, Mobile App"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                        <input
                          type="text"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
                          placeholder="Brief description for project cards"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                        <textarea
                          name="fdescription"
                          value={formData.fdescription}
                          onChange={handleInputChange}
                          rows="4"
                          className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm transition-all duration-300 resize-none"
                          placeholder="Detailed project description"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                          <input
                            type="date"
                            name="sdate"
                            value={formData.sdate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                          <input
                            type="date"
                            name="edate"
                            value={formData.edate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                        <input
                          type="text"
                          name="technologies"
                          value={formData.technologies}
                          onChange={handleInputChange}
                          placeholder="React, Node.js, MongoDB (comma separated)"
                          className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Link</label>
                        <input
                          type="url"
                          name="gitlink"
                          value={formData.gitlink}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                        <input
                          type="url"
                          name="liveurl"
                          value={formData.liveurl}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
                          placeholder="https://project-demo.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
                        />
                        {imageFile && (
                          <div className="mt-3 p-3 bg-sky-50 rounded-lg">
                            <p className="text-sm text-sky-700 font-medium">Selected: {imageFile.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-sky-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-white border border-sky-200 text-gray-700 rounded-lg hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-sky-500 via-sky-600 to-black hover:from-sky-600 hover:via-sky-700 hover:to-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editMode ? 'Updating...' : 'Creating...'}
                        </span>
                      ) : (
                        editMode ? 'Update Project' : 'Add Project'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && currentProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm border border-sky-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">
                    Project Details
                  </h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-sky-600 hover:bg-sky-50 p-2 rounded-lg transition-all duration-300"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {currentProject.imgurl && (
                    <div className="rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src={currentProject.imgurl} 
                        alt={currentProject.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{currentProject.title}</h3>
                    {currentProject.category && (
                      <span className="bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                        {currentProject.category}
                      </span>
                    )}
                  </div>

                  {currentProject.description && (
                    <div className="bg-sky-50/80 backdrop-blur-sm p-4 rounded-xl border border-sky-200">
                      <h4 className="font-semibold text-sky-800 mb-2">Description</h4>
                      <p className="text-gray-700">{currentProject.description}</p>
                    </div>
                  )}

                  {currentProject.fdescription && (
                    <div className="bg-sky-50/80 backdrop-blur-sm p-4 rounded-xl border border-sky-200">
                      <h4 className="font-semibold text-sky-800 mb-2">Full Description</h4>
                      <p className="text-gray-700">{currentProject.fdescription}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentProject.sdate && (
                      <div className="bg-sky-50/80 backdrop-blur-sm p-4 rounded-xl border border-sky-200">
                        <h4 className="font-semibold text-sky-800 mb-2 flex items-center gap-2">
                          <Calendar size={16} className="text-sky-600" />
                          Start Date
                        </h4>
                        <p className="text-gray-700">
                          {new Date(currentProject.sdate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {currentProject.edate && (
                      <div className="bg-sky-50/80 backdrop-blur-sm p-4 rounded-xl border border-sky-200">
                        <h4 className="font-semibold text-sky-800 mb-2 flex items-center gap-2">
                          <Calendar size={16} className="text-sky-600" />
                          End Date
                        </h4>
                        <p className="text-gray-700">
                          {new Date(currentProject.edate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {currentProject.technologies && (
                    <div className="bg-sky-50/80 backdrop-blur-sm p-4 rounded-xl border border-sky-200">
                      <h4 className="font-semibold text-sky-800 mb-2">Technologies</h4>
                      <p className="text-gray-700">{currentProject.technologies}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    {currentProject.gitlink && (
                      <a
                        href={currentProject.gitlink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg"
                      >
                        <Github size={20} />
                        GitHub Repository
                      </a>
                    )}
                    {currentProject.liveurl && (
                      <a
                        href={currentProject.liveurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                      >
                        <Globe size={20} />
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
