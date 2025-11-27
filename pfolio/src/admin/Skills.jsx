import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

export default function Skills({ openAddModal = false, onResetQuickAction }) {
  const location = useLocation();
  
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [filter, setFilter] = useState('All Categories');
  const [categories, setCategories] = useState([
    'Languages', 
    'Frontend', 
    'Backend', 
    'Databases',
    'Tools & Others'
  ]);
  
  const [formData, setFormData] = useState({
    skillname: '',
    category: 'Languages',
    iconUrl: '',
    description: '',
    learningtype: '',
    isLearning: false
  });

  // Handle quick action from Dashboard or AdminNavBar
  useEffect(() => {
    if (openAddModal || (location.state?.triggerAction === 'add' && location.state?.fromDashboard)) {
      setShowAddModal(true);
      if (onResetQuickAction) {
        onResetQuickAction();
      }
      // Clear the navigation state after using it
      if (location.state?.fromDashboard) {
        window.history.replaceState({}, document.title);
      }
    }
  }, [openAddModal, onResetQuickAction, location.state]);

  // Configure axios defaults to handle CORS
  useEffect(() => {
    axios.defaults.withCredentials = false;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common['Accept'] = 'application/json';
  }, []);

  // Fetch all skills on component mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Fetch skills from API with better error handling
  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${config.url}/skills/all`, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setSkills(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skills:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection and try again.');
      } else if (err.response) {
        setError(`Server error: ${err.response.status}. Please try again later.`);
      } else if (err.request) {
        setError('Unable to connect to server. Please check if the backend is running.');
      } else {
        setError('Failed to load skills. Please try again later.');
      }
      
      setLoading(false);
    }
  };

  // Filter skills by category with improved error handling
  const fetchSkillsByCategory = async (category) => {
    if (category === 'All Categories') {
      fetchSkills();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${config.url}/skills/category/${category}`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setSkills(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skills by category:', err);
      setError(`Failed to load ${category} skills. Please try again.`);
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (category) => {
    setFilter(category);
    fetchSkillsByCategory(category);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle add skill form submission with better error handling
  const handleAddSkill = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await axios.post(`${config.url}/skills/add`, formData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Reset form and close modal
      setFormData({
        skillname: '',
        category: 'Languages',
        iconUrl: '',
        description: '',
        learningtype: '',
        isLearning: false
      });
      
      setShowAddModal(false);
      fetchSkills(); // Refresh skills list
    } catch (err) {
      console.error('Error adding skill:', err);
      setError('Failed to add skill. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit skill form submission with better error handling
  const handleEditSkill = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Use the skill ID for the API endpoint (MySQL backend uses numeric IDs)
      const skillId = selectedSkill.id;
      
      await axios.put(`${config.url}/skills/update/${skillId}`, formData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Reset form and close modal
      setSelectedSkill(null);
      setShowEditModal(false);
      fetchSkills(); // Refresh skills list
    } catch (err) {
      console.error('Error updating skill:', err);
      setError('Failed to update skill. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a skill with improved error handling
  const handleDeleteSkill = async (skillId, skillName) => {
    if (!skillId) {
      setError('Skill ID is missing. Cannot delete.');
      console.error('Delete attempt failed: skillId is undefined or empty');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${skillName}?`)) {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Sending DELETE request to: ${config.url}/skills/delete/${skillId}`);
        
        const response = await axios.delete(`${config.url}/skills/delete/${skillId}`, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.status === 200) {
          setError(null);
          // Update local state to remove the deleted skill
          setSkills(skills.filter(skill => skill.id !== skillId));
          // Show success message
          alert(`Skill "${skillName}" deleted successfully!`);
          console.log(`Skill "${skillName}" deleted successfully`);
        }
      } catch (err) {
        console.error('Error deleting skill:', err);
        const errorMessage = err.response?.data?.message || `Failed to delete "${skillName}". Please try again.`;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  // Open edit modal and populate form with skill data
  const openEditModal = (skill) => {
    setSelectedSkill(skill);
    setFormData({
      skillname: skill.skillname || '',
      category: skill.category || '',
      iconUrl: skill.iconUrl || '',
      description: skill.description || '',
      learningtype: skill.learningtype || '',
      isLearning: skill.isLearning || false
    });
    setShowEditModal(true);
  };

  // Get icon for skill based on name or iconUrl - Sky Blue Theme
  const getSkillIcon = (skill) => {
    if (skill.iconUrl) {
      return (
        <img 
          src={skill.iconUrl} 
          alt={skill.skillname} 
          className="w-8 h-8 rounded-md object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }
    
    // Default icon with sky blue theme
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-sky-100 to-sky-200 rounded-md flex items-center justify-center">
        <span className="text-sky-700 font-semibold text-sm">
          {(skill.skillname || '').charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl shadow-lg">
          <div className="px-6 py-8 border-b border-sky-200/50">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-2">
              Skills Management
            </h1>
            <p className="text-gray-600">Manage your technical skills and expertise</p>
          </div>
          
          {/* Error message - Sky Blue Theme */}
          {error && (
            <div className="mx-6 mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
              <div className="flex justify-between items-center">
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
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Category filters and Add button - Sky Blue Theme - Mobile Responsive */}
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="w-full">
                <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-3">
                  Filter by Category
                </h2>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleFilterChange(category)}
                      className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                        filter === category 
                          ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-200' 
                          : 'bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 border border-sky-200/50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                  <button
                    onClick={() => handleFilterChange('All Categories')}
                    className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                      filter === 'All Categories' 
                        ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-200' 
                        : 'bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 border border-sky-200/50'
                    }`}
                  >
                    All Categories
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setFormData({
                    skillname: '',
                    category: 'Languages',
                    iconUrl: '',
                    description: '',
                    learningtype: '',
                    isLearning: false
                  });
                  setShowAddModal(true);
                }}
                className="w-full lg:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium transform hover:scale-105 text-sm sm:text-base touch-manipulation"
              >
                <span className="sm:hidden">+ Add Skill</span>
                <span className="hidden sm:inline">+ Add New Skill</span>
              </button>
            </div>

            {/* Skills Grid - Sky Blue Theme - Mobile Responsive */}
            {loading && !showAddModal && !showEditModal ? (
              <div className="flex justify-center items-center py-12 sm:py-20">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin"></div>
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-sky-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-base sm:text-lg font-medium bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-2">
                  No skills found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">Get started by adding your first skill!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:shadow-sky-100/50 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex-shrink-0 mr-2 sm:mr-3">
                          {getSkillIcon(skill)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent truncate">
                            {skill.skillname}
                          </h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 mt-1">
                            {skill.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 ml-2">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="text-sky-600 hover:text-white hover:bg-sky-600 p-1.5 sm:p-2 rounded-lg transition-all duration-300 touch-manipulation"
                          title="Edit skill"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id, skill.skillname)}
                          className="text-red-600 hover:text-white hover:bg-red-600 p-1.5 sm:p-2 rounded-lg transition-all duration-300 touch-manipulation"
                          title="Delete skill"
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {skill.description && (
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-3">
                        {skill.description}
                      </p>
                    )}
                    
                    {skill.learningtype && (
                      <div className="flex items-center text-xs sm:text-sm text-sky-600">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="truncate">Learning: {skill.learningtype}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Skill Modal - Sky Blue Theme - Mobile Responsive */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white/90 backdrop-blur-sm border border-sky-200/50 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full mx-4">
              <div className="bg-white/80 backdrop-blur-sm px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-medium bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">
                    Add New Skill
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-sky-600 hover:bg-sky-50 p-2 rounded-lg transition-all duration-300 touch-manipulation"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleAddSkill} className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="skillname" className="block text-sm font-medium text-black mb-1">
                      Skill Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="skillname"
                      name="skillname"
                      required
                      value={formData.skillname}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-sky-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="e.g., React.js, Python, Docker"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-black mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-sky-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="iconUrl" className="block text-sm font-medium text-black mb-1">
                      Icon URL
                    </label>
                    <input
                      type="url"
                      id="iconUrl"
                      name="iconUrl"
                      value={formData.iconUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-sky-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="https://example.com/icon.png"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-sky-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base resize-none"
                      placeholder="Brief description of your experience with this skill"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="learningtype" className="block text-sm font-medium text-black mb-1">
                      Learning Type
                    </label>
                    <input
                      type="text"
                      id="learningtype"
                      name="learningtype"
                      value={formData.learningtype}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-sky-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="e.g., Online Course, Self-taught, Bootcamp"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isLearning"
                      name="isLearning"
                      checked={formData.isLearning}
                      onChange={handleChange}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-sky-300 rounded"
                    />
                    <label htmlFor="isLearning" className="ml-2 block text-sm text-black">
                      Currently Learning
                    </label>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="w-full sm:w-auto px-4 py-2.5 border border-sky-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white/80 hover:bg-sky-50 transition-all duration-300 touch-manipulation"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-lg shadow-sm text-sm font-medium transition-all duration-300 disabled:opacity-50 touch-manipulation"
                    >
                      {loading ? 'Adding...' : 'Add Skill'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Skill Modal - Sky Blue Theme - Mobile Responsive */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white/90 backdrop-blur-sm border border-sky-200/50 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full mx-4">
              <div className="bg-white/80 backdrop-blur-sm px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-medium bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent pr-2 truncate">
                    Edit: {selectedSkill?.skillname}
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-sky-600 hover:bg-sky-50 p-2 rounded-lg transition-all duration-300 touch-manipulation flex-shrink-0"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleEditSkill} className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="edit-skillname" className="block text-sm font-medium text-black mb-1">
                      Skill Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="edit-skillname"
                      name="skillname"
                      required
                      value={formData.skillname}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-sky-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-category" className="block text-sm font-medium text-black mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="edit-category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-sky-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-iconUrl" className="block text-sm font-medium text-black mb-1">
                      Icon URL
                    </label>
                    <input
                      type="url"
                      id="edit-iconUrl"
                      name="iconUrl"
                      value={formData.iconUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-sky-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="https://example.com/icon.png"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-black mb-1">
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-sky-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base resize-none"
                      placeholder="Brief description of your experience with this skill"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-learningtype" className="block text-sm font-medium text-black mb-1">
                      Learning Type
                    </label>
                    <input
                      type="text"
                      id="edit-learningtype"
                      name="learningtype"
                      value={formData.learningtype}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:py-2.5 border border-sky-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="e.g., Online Course, Self-taught, Bootcamp"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit-isLearning"
                      name="isLearning"
                      checked={formData.isLearning}
                      onChange={handleChange}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-sky-300 rounded"
                    />
                    <label htmlFor="edit-isLearning" className="ml-2 block text-sm text-black">
                      Currently Learning
                    </label>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="w-full sm:w-auto px-4 py-2.5 border border-sky-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white/80 hover:bg-sky-50 transition-all duration-300 touch-manipulation"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-lg shadow-sm text-sm font-medium transition-all duration-300 disabled:opacity-50 touch-manipulation"
                    >
                      {loading ? 'Updating...' : 'Update Skill'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}