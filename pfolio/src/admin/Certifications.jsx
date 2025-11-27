import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { format } from 'date-fns';

export default function Certifications({ openAddModal = false, onResetQuickAction }) {
  const location = useLocation();
  
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const initialFormData = {
    title: '',
    issuer: '',
    issueDate: '',
    expDate: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    status: 'Active'
  };
  
  const [formData, setFormData] = useState(initialFormData);

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

  // Fetch certifications on component mount
  useEffect(() => {
    fetchCertifications();
  }, []);

  // Fetch all certifications from API
  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.url}/certifications/viewAll`);
      setCertifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching certifications:', err);
      setError('Failed to load certifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Add new certification
  const handleAddCertification = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validation
      if (!formData.title.trim() || !formData.issuer.trim()) {
        setError('Title and Issuer are required fields');
        setLoading(false);
        return;
      }
      
      // Create FormData object to handle file upload
      const certFormData = new FormData();
      
      // Create a Certifications object with the form data
      const certificationObject = {
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        issueDate: formData.issueDate ? new Date(formData.issueDate).toISOString() : null,
        expDate: formData.expDate ? new Date(formData.expDate).toISOString() : null,
        credentialId: formData.credentialId.trim(),
        credentialUrl: formData.credentialUrl.trim(),
        description: formData.description.trim(),
        status: formData.status || 'Active'
      };
      
      // Append the Certifications object as a JSON string
      certFormData.append("certification", new Blob([JSON.stringify(certificationObject)], {
        type: "application/json"
      }));
      
      // Add image file if selected
      if (selectedImage) {
        certFormData.append("image", selectedImage);
      }
      
      console.log('Sending certification data:', certificationObject);
      
      // Send POST request to add certification
      const response = await axios.post(`${config.url}/certifications/add`, certFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 seconds timeout
      });
      
      console.log('Server response:', response.data);
      
      if (response.status === 200 || response.status === 201) {
        // Reset form and close modal
        setFormData(initialFormData);
        setSelectedImage(null);
        setImagePreview(null);
        setShowAddModal(false);
        
        // Refresh certifications list
        await fetchCertifications();
        
        setError(null);
      }
    } catch (err) {
      console.error('Error adding certification:', err);
      
      if (err.response) {
        console.error('Server response:', err.response.data);
        setError(`Failed to add certification: ${err.response.data.message || 'Server error'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error:', err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update existing certification
  const handleUpdateCertification = async (e) => {
    e.preventDefault();
    
    if (!selectedCertification) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Validation
      if (!formData.title.trim() || !formData.issuer.trim()) {
        setError('Title and Issuer are required fields');
        setLoading(false);
        return;
      }
      
      // Create FormData object to handle file upload
      const certFormData = new FormData();
      
      // Create a Certifications object with the form data
      const certificationObject = {
        id: selectedCertification.id,
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        issueDate: formData.issueDate ? new Date(formData.issueDate).toISOString() : null,
        expDate: formData.expDate ? new Date(formData.expDate).toISOString() : null,
        credentialId: formData.credentialId.trim(),
        credentialUrl: formData.credentialUrl.trim(),
        description: formData.description.trim(),
        status: formData.status || 'Active'
      };
      
      // Only include existing image URL if no new image is being uploaded
      if (!selectedImage && selectedCertification.imgUrl) {
        certificationObject.imgUrl = selectedCertification.imgUrl;
      }
      
      // Append the Certifications object as a JSON string
      certFormData.append("certification", new Blob([JSON.stringify(certificationObject)], {
        type: "application/json"
      }));
      
      // Add image file if selected
      if (selectedImage) {
        certFormData.append("image", selectedImage);
      }
      
      console.log('Updating certification data:', certificationObject);
      
      // Send PUT request to update certification
      const response = await axios.put(
        `${config.url}/certifications/update/${selectedCertification.id}`, 
        certFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 // 30 seconds timeout
        }
      );
      
      console.log('Update response:', response.data);
      
      if (response.status === 200) {
        // Reset form and close modal
        setFormData(initialFormData);
        setSelectedImage(null);
        setImagePreview(null);
        setShowEditModal(false);
        setSelectedCertification(null);
        
        // Refresh certifications list
        await fetchCertifications();
        
        setError(null);
      }
    } catch (err) {
      console.error('Error updating certification:', err);
      
      if (err.response) {
        console.error('Server response:', err.response.data);
        setError(`Failed to update certification: ${err.response.data.message || 'Server error'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error:', err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete certification
  const handleDeleteCertification = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.delete(`${config.url}/certifications/delete/${id}`, {
          timeout: 10000 // 10 seconds timeout
        });
        
        if (response.status === 200) {
          // Update local state to remove deleted certification
          setCertifications(certifications.filter(cert => cert.id !== id));
          setError(null);
        }
      } catch (err) {
        console.error('Error deleting certification:', err);
        
        if (err.response) {
          setError(`Failed to delete certification: ${err.response.data.message || 'Server error'}`);
        } else if (err.request) {
          setError('No response from server. Please check your connection.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Open edit modal with certification data
  const openEditModal = (certification) => {
    setSelectedCertification(certification);
    setFormData({
      title: certification.title || '',
      issuer: certification.issuer || '',
      issueDate: certification.issueDate ? format(new Date(certification.issueDate), 'yyyy-MM-dd') : '',
      expDate: certification.expDate ? format(new Date(certification.expDate), 'yyyy-MM-dd') : '',
      credentialId: certification.credentialId || '',
      credentialUrl: certification.credentialUrl || '',
      description: certification.description || '',
      status: certification.status || 'Active'
    });
    setImagePreview(certification.imgUrl || null);
    setSelectedImage(null); // Reset selected image
    setShowEditModal(true);
  };

  // Close modals and reset form
  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedCertification(null);
    setFormData(initialFormData);
    setSelectedImage(null);
    setImagePreview(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl shadow-lg">
          <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-sky-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-sky-500 via-sky-600 to-black rounded-lg flex items-center justify-center mr-0 sm:mr-3 mb-2 sm:mb-0 shadow-md">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">
                  Certifications Management
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm">Manage your professional certifications</p>
              </div>
            </div>
            <div className="flex items-center text-sky-600 text-xs sm:text-sm font-medium">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Total Certifications: {certifications.length}
            </div>
          </div>
          
          {/* Error message - Sky Blue Theme - Mobile Responsive */}
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
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-6">
            {/* Add button - Sky Blue Theme - Mobile Responsive */}
            <div className="flex justify-end mb-4 sm:mb-6">
              <button
                onClick={() => {
                  setFormData(initialFormData);
                  setSelectedImage(null);
                  setImagePreview(null);
                  setError(null);
                  setShowAddModal(true);
                }}
                className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium transform hover:scale-105 text-sm sm:text-base touch-manipulation"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add New Certification</span>
              </button>
            </div>

            {/* Certifications list - Sky Blue Theme - Mobile Responsive */}
            {loading && !showAddModal && !showEditModal ? (
              <div className="flex justify-center items-center py-12 sm:py-20">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin"></div>
              </div>
            ) : certifications.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-2">
                  No certifications found
                </h3>
                <p className="text-gray-500 mb-4 text-sm sm:text-base">Get started by adding your first certification!</p>
                <button
                  onClick={() => {
                    setFormData(initialFormData);
                    setSelectedImage(null);
                    setImagePreview(null);
                    setError(null);
                    setShowAddModal(true);
                  }}
                  className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base touch-manipulation"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Your First Certification
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {certifications.map((certification, index) => (
                  <div 
                    key={certification.id} 
                    className="group bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl shadow-sm hover:shadow-lg hover:shadow-sky-100/50 transition-all duration-300 overflow-hidden transform hover:scale-105"
                  >
                    {/* Certification Image - Sky Blue Theme - Mobile Responsive */}
                    <div className="relative h-36 sm:h-48 bg-gradient-to-br from-sky-50 to-sky-100 overflow-hidden">
                      {certification.imgUrl ? (
                        <div className="w-full h-full p-3 sm:p-4 flex items-center justify-center">
                          <img 
                            className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-105 rounded-lg" 
                            src={certification.imgUrl} 
                            alt={certification.title}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        </div>
                      ) : null}
                      <div 
                        className={`w-full h-full flex items-center justify-center ${certification.imgUrl ? 'hidden' : 'flex'}`}
                        style={{ display: certification.imgUrl ? 'none' : 'flex' }}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 bg-white rounded-xl flex items-center justify-center shadow-md border border-sky-200">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-xs sm:text-sm text-sky-600 font-medium">Certificate Image</p>
                        </div>
                      </div>
                      
                      {/* Status badge - Sky Blue Theme - Mobile Responsive */}
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full ${
                          certification.status === 'Active' 
                            ? 'bg-sky-100 text-sky-800 border border-sky-200' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {certification.status || 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content - Sky Blue Theme - Mobile Responsive */}
                    <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
                      {/* Title and Issuer */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent line-clamp-2 leading-tight">
                          {certification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sky-600 rounded-full"></div>
                          <p className="text-xs sm:text-sm font-medium text-sky-600 truncate">
                            {certification.issuer}
                          </p>
                        </div>
                        {certification.credentialId && (
                          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 text-xs text-sky-700 bg-sky-50 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-sky-200">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="font-mono truncate">ID: {certification.credentialId}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {certification.description && (
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {certification.description}
                        </p>
                      )}

                      {/* Dates - Sky Blue Theme - Mobile Responsive */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-black">Issue Date</p>
                            <p className="text-gray-500 text-xs truncate">{formatDate(certification.issueDate)}</p>
                          </div>
                        </div>
                        {certification.expDate && (
                          <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-black">Expiry Date</p>
                              <p className="text-gray-500 text-xs truncate">{formatDate(certification.expDate)}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Credential URL - Mobile Responsive */}
                      {certification.credentialUrl && (
                        <a
                          href={certification.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-sky-600 hover:text-white font-medium bg-sky-50 hover:bg-sky-600 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all duration-300 border border-sky-200 hover:border-sky-600 touch-manipulation"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span className="truncate">View Credential</span>
                        </a>
                      )}

                      {/* Action Buttons - Sky Blue Theme - Mobile Responsive */}
                      <div className="flex space-x-2 sm:space-x-3 pt-2 sm:pt-3 border-t border-sky-200/50">
                        <button
                          onClick={() => openEditModal(certification)}
                          className="flex-1 inline-flex items-center justify-center px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 hover:text-sky-700 transition-all duration-300 border border-sky-200 touch-manipulation"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCertification(certification.id)}
                          className="flex-1 inline-flex items-center justify-center px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 hover:text-red-700 transition-all duration-300 border border-red-200 touch-manipulation"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Certification Modal - Sky Blue Theme */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white/90 backdrop-blur-sm border border-sky-200/50 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white/80 backdrop-blur-sm px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">
                      Add New Certification
                    </h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-sky-600 hover:bg-sky-50 p-2 rounded-lg transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleAddCertification} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-black mb-1">
                      Certification Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                      placeholder="e.g., AWS Certified Solutions Architect"
                      required
                    />
                  </div>

                  {/* Issuer */}
                  <div>
                    <label htmlFor="issuer" className="block text-sm font-medium text-black mb-1">
                      Issuer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="issuer"
                      name="issuer"
                      value={formData.issuer}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                      placeholder="e.g., Amazon Web Services"
                      required
                    />
                  </div>

                  {/* Issue Date */}
                  <div>
                    <label htmlFor="issueDate" className="block text-sm font-medium text-black mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      id="issueDate"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label htmlFor="expDate" className="block text-sm font-medium text-black mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      id="expDate"
                      name="expDate"
                      value={formData.expDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  {/* Credential ID */}
                  <div>
                    <label htmlFor="credentialId" className="block text-sm font-medium text-black mb-1">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      id="credentialId"
                      name="credentialId"
                      value={formData.credentialId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                      placeholder="e.g., AWS-ASA-12345"
                    />
                  </div>

                  {/* Credential URL */}
                  <div>
                    <label htmlFor="credentialUrl" className="block text-sm font-medium text-black mb-1">
                      Credential URL
                    </label>
                    <input
                      type="url"
                      id="credentialUrl"
                      name="credentialUrl"
                      value={formData.credentialUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                      placeholder="https://www.credly.com/badges/..."
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                      placeholder="Brief description of the certification..."
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-black mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-black mb-1">
                      Certification Image
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-20 w-20 object-cover rounded-lg border border-sky-200"
                        />
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 border border-sky-200 rounded-lg hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 transition-all duration-300"
                    >
                      {loading ? 'Adding...' : 'Add Certification'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Certification Modal - Sky Blue Theme */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white/90 backdrop-blur-sm border border-sky-200/50 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white/80 backdrop-blur-sm px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">
                      Edit Certification
                    </h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-sky-600 hover:bg-sky-50 p-2 rounded-lg transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleUpdateCertification} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-black mb-1">
                      Certification Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="edit-title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                      placeholder="e.g., AWS Certified Solutions Architect"
                      required
                    />
                  </div>

                  {/* Issuer */}
                  <div>
                    <label htmlFor="edit-issuer" className="block text-sm font-medium text-black mb-1">
                      Issuer <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="edit-issuer"
                      name="issuer"
                      value={formData.issuer}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                      placeholder="e.g., Amazon Web Services"
                      required
                    />
                  </div>

                  {/* Issue Date */}
                  <div>
                    <label htmlFor="edit-issueDate" className="block text-sm font-medium text-black mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      id="edit-issueDate"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label htmlFor="edit-expDate" className="block text-sm font-medium text-black mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      id="edit-expDate"
                      name="expDate"
                      value={formData.expDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  {/* Credential ID */}
                  <div>
                    <label htmlFor="edit-credentialId" className="block text-sm font-medium text-black mb-1">
                      Credential ID
                    </label>
                    <input
                      type="text"
                      id="edit-credentialId"
                      name="credentialId"
                      value={formData.credentialId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                      placeholder="e.g., AWS-ASA-12345"
                    />
                  </div>

                  {/* Credential URL */}
                  <div>
                    <label htmlFor="edit-credentialUrl" className="block text-sm font-medium text-black mb-1">
                      Credential URL
                    </label>
                    <input
                      type="url"
                      id="edit-credentialUrl"
                      name="credentialUrl"
                      value={formData.credentialUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                      placeholder="https://www.credly.com/badges/..."
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-black mb-1">
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                      placeholder="Brief description of the certification..."
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="edit-status" className="block text-sm font-medium text-black mb-1">
                      Status
                    </label>
                    <select
                      id="edit-status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label htmlFor="edit-image" className="block text-sm font-medium text-black mb-1">
                      Certification Image
                    </label>
                    <input
                      type="file"
                      id="edit-image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-20 w-20 object-cover rounded-lg border border-sky-200"
                        />
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 border border-sky-200 rounded-lg hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 transition-all duration-300"
                    >
                      {loading ? 'Updating...' : 'Update Certification'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for text truncation */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}