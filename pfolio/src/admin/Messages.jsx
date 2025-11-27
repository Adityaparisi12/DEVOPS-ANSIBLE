import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { isHostedBackend } from '../utils/backendUtils';


export default function Messages({ openComposeModal = false, onResetQuickAction }) {
  const location = useLocation();
  
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyData, setReplyData] = useState({
    email: '',
    subject: '',
    message: ''
  });
  const [sendingReply, setSendingReply] = useState(false);
  const [filter, setFilter] = useState('all'); // all, read, unread
  const [searchTerm, setSearchTerm] = useState('');

  // Handle quick action from Dashboard or AdminNavBar
  useEffect(() => {
    if (openComposeModal || (location.state?.triggerAction === 'open' && location.state?.fromDashboard)) {
      // For messages, we just open the page, no special modal needed
      if (onResetQuickAction) {
        onResetQuickAction();
      }
      // Clear the navigation state after using it
      if (location.state?.fromDashboard) {
        window.history.replaceState({}, document.title);
      }
    }
  }, [openComposeModal, onResetQuickAction, location.state]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch messages from backend API
      const response = await axios.get(`${config.url}/contacts/all`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Transform backend data to match component format
      const transformedMessages = response.data.map(msg => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        timestamp: new Date(msg.timestamp || msg.createdAt || Date.now()),
        read: msg.read || false // Default to unread if not specified
      }));
      
      setMessages(transformedMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;
        
        switch (status) {
          case 404:
            setError('Messages endpoint not found. Please check if the backend server is running.');
            break;
          case 500:
            setError('Server error while fetching messages. Please try again later.');
            break;
          default:
            setError(message || 'Failed to load messages. Please try again.');
        }
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your connection and ensure the backend server is running.');
      } else {
        // Other error
        setError('An unexpected error occurred while loading messages.');
      }
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const markAsUnread = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: false } : msg
    ));
  };

  const deleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        setDeleteLoading(true);
        setError(null);
        
        // Delete message from backend
        await axios.delete(`${config.url}/contacts/delete/${messageId}`, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        // Remove message from local state
        setMessages(messages.filter(msg => msg.id !== messageId));
        setShowModal(false);
        setSelectedMessage(null);
        
        // Show success feedback (optional)
        console.log(`Message ${messageId} deleted successfully`);
        
      } catch (err) {
        console.error('Error deleting message:', err);
        
        if (err.response) {
          // Server responded with error status
          const status = err.response.status;
          const message = err.response.data?.message || err.response.data?.error;
          
          switch (status) {
            case 404:
              setError('Message not found or already deleted.');
              // Remove from local state anyway since it doesn't exist
              setMessages(messages.filter(msg => msg.id !== messageId));
              setShowModal(false);
              setSelectedMessage(null);
              break;
            case 500:
              setError('Server error while deleting message. Please try again.');
              break;
            default:
              setError(message || 'Failed to delete message. Please try again.');
          }
        } else if (err.request) {
          // Network error
          setError('Network error. Please check your connection and try again.');
        } else {
          // Other error
          setError('An unexpected error occurred while deleting the message.');
        }
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const openReplyModal = (message) => {
    setReplyData({
      email: message.email,
      subject: `Re: ${message.subject}`,
      message: ''
    });
    setShowReplyModal(true);
  };

  const closeReplyModal = () => {
    setShowReplyModal(false);
    setReplyData({
      email: '',
      subject: '',
      message: ''
    });
    setSendingReply(false);
  };

  const sendReply = async (retryCount = 0) => {
    if (!replyData.message.trim()) {
      setError('Please enter a message before sending.');
      return;
    }

    try {
      setSendingReply(true);
      setError(null);

      // Send reply to backend with increased timeout for hosted services
      await axios.post(`${config.url}/message/reply`, {
        email: replyData.email,
        subject: replyData.subject,
        message: replyData.message
      }, {
        timeout: 60000, // Increased to 60 seconds for hosted backend
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Success - close modal and show success message
      closeReplyModal();
      setShowModal(false);
      
      // You could show a success toast here
      alert('Reply sent successfully!');
      
    } catch (err) {
      console.error('Error sending reply:', err);
      
      let errorMessage = 'Failed to send reply. Please try again.';
      
      if (err.code === 'ECONNABORTED') {
        // Handle timeout with retry option for hosted backends
        if (retryCount < 2) {
          setSendingReply(false);
          const shouldRetry = window.confirm(
            `Request timeout (hosted backend may be sleeping). This is normal for free hosting services.\n\nRetry attempt ${retryCount + 1}/2?\n\nClick OK to retry or Cancel to stop.`
          );
          
          if (shouldRetry) {
            // Retry with exponential backoff
            setTimeout(() => sendReply(retryCount + 1), (retryCount + 1) * 2000);
            return;
          }
        }
        errorMessage = 'Request timeout after multiple attempts. The hosted backend may be experiencing issues. Please try again later.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;
        
        switch (status) {
          case 400:
            errorMessage = 'Invalid email data. Please check your message.';
            break;
          case 404:
            errorMessage = 'Reply endpoint not found. Please check backend server.';
            break;
          case 500:
            errorMessage = 'Server error while sending reply. Please try again.';
            break;
          case 503:
            errorMessage = 'Backend service unavailable. The hosted server may be starting up. Please wait and try again.';
            break;
          default:
            errorMessage = message || 'Failed to send reply. Please try again.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setSendingReply(false);
    }
  };

  const openMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'read' && message.read) || 
                         (filter === 'unread' && !message.read);
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-sm border border-sky-200/50 rounded-xl shadow-lg">
          {/* Header */}
          <div className="px-4 sm:px-6 py-6 sm:py-8 border-b border-sky-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-sky-500 via-sky-600 to-black rounded-lg flex items-center justify-center mr-3 shadow-md">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">
                    Messages
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {messages.length} total messages
                    {unreadCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                        {unreadCount} unread
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Refresh Button */}
              <div className="flex items-center">
                <button
                  onClick={fetchMessages}
                  disabled={loading}
                  className={`inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base touch-manipulation ${
                    loading 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg shadow-sky-200'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Hosted Backend Info Banner */}
          {isHostedBackend() && (
            <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded-r-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>Hosted Backend Notice:</strong> The first request may take 30-60 seconds as the server starts up. Subsequent requests will be faster.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
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
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-6">
            {/* Filters and Search - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                    filter === 'all' 
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-200' 
                      : 'bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 border border-sky-200/50'
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                    filter === 'unread' 
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-200' 
                      : 'bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 border border-sky-200/50'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                    filter === 'read' 
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-200' 
                      : 'bg-white/80 text-gray-700 hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 border border-sky-200/50'
                  }`}
                >
                  Read ({messages.length - unreadCount})
                </button>
              </div>
              
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2 pl-8 sm:pl-10 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                />
                <svg className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Messages List - Mobile Responsive */}
            {loading ? (
              <div className="flex justify-center items-center py-12 sm:py-20">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin"></div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-sky-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent mb-2">
                  No messages found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  {searchTerm ? 'Try adjusting your search terms' : 'New messages will appear here when visitors contact you'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {filteredMessages.map((message) => (
                  <div 
                    key={message.id} 
                    onClick={() => openMessage(message)}
                    className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:shadow-md touch-manipulation ${
                      message.read 
                        ? 'bg-white/80 border-gray-200 hover:border-sky-300' 
                        : 'bg-sky-50/80 border-sky-200 hover:border-sky-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1 sm:mb-2">
                          <h4 className={`text-sm sm:text-base font-medium truncate ${
                            message.read ? 'text-gray-900' : 'text-black font-semibold'
                          }`}>
                            {message.name}
                          </h4>
                          {!message.read && (
                            <div className="w-2 h-2 bg-sky-600 rounded-full ml-2 flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">
                          {message.email}
                        </p>
                        <p className={`text-sm sm:text-base mb-1 sm:mb-2 truncate ${
                          message.read ? 'text-gray-800' : 'text-black font-medium'
                        }`}>
                          {message.subject}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                          {message.message}
                        </p>
                      </div>
                      <div className="ml-3 sm:ml-4 flex-shrink-0 text-right">
                        <p className="text-xs text-gray-500 mb-2">
                          {formatTimestamp(message.timestamp)}
                        </p>
                        <div className="flex space-x-1">
                          {message.read ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsUnread(message.id);
                              }}
                              className="p-1 text-gray-400 hover:text-sky-600 transition-colors touch-manipulation"
                              title="Mark as unread"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(message.id);
                              }}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors touch-manipulation"
                              title="Mark as read"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal - Mobile Responsive */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white/90 backdrop-blur-sm border border-sky-200/50 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full mx-4">
              <div className="bg-white/80 backdrop-blur-sm px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-medium bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent truncate">
                        {selectedMessage.subject}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        From: {selectedMessage.name} ({selectedMessage.email})
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-sky-600 hover:bg-sky-50 p-2 rounded-lg transition-all duration-300 touch-manipulation flex-shrink-0 ml-2"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-sky-50/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-sky-200/50">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      Received: {selectedMessage.timestamp.toLocaleString()}
                    </p>
                    <div className="prose prose-sm sm:prose max-w-none">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                    <button
                      onClick={() => openReplyModal(selectedMessage)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-lg transition-all duration-300 font-medium text-sm sm:text-base touch-manipulation"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Reply
                    </button>
                    
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      disabled={deleteLoading}
                      className={`flex-1 inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all duration-300 border font-medium text-sm sm:text-base touch-manipulation ${
                        deleteLoading 
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                          : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200'
                      }`}
                    >
                      {deleteLoading ? (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 border border-sky-200 text-sky-600 rounded-lg hover:bg-sky-50 transition-all duration-300 font-medium text-sm sm:text-base touch-manipulation"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal - Mobile Responsive */}
      {showReplyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white/90 backdrop-blur-sm border border-sky-200/50 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full mx-4">
              <div className="bg-white/80 backdrop-blur-sm px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-medium bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">
                        Send Reply
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Compose your response message
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeReplyModal}
                    className="text-gray-400 hover:text-sky-600 hover:bg-sky-50 p-2 rounded-lg transition-all duration-300 touch-manipulation"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* To Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To:
                    </label>
                    <input
                      type="email"
                      value={replyData.email}
                      onChange={(e) => setReplyData({...replyData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="recipient@email.com"
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject:
                    </label>
                    <input
                      type="text"
                      value={replyData.subject}
                      onChange={(e) => setReplyData({...replyData, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Re: Original Subject"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message:
                    </label>
                    <textarea
                      value={replyData.message}
                      onChange={(e) => setReplyData({...replyData, message: e.target.value})}
                      rows="8"
                      className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base resize-none"
                      placeholder="Type your reply message here..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {replyData.message.length} characters
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                    <button
                      onClick={sendReply}
                      disabled={sendingReply || !replyData.message.trim()}
                      className={`flex-1 inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base touch-manipulation ${
                        sendingReply || !replyData.message.trim()
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg shadow-sky-200'
                      }`}
                    >
                      {sendingReply ? (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                          {isHostedBackend() ? 'Sending... (This may take up to 60s for hosted backend)' : 'Sending...'}
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send Reply
                        </>
                      )}
                    </button>

                    <button
                      onClick={closeReplyModal}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5 border border-sky-200 text-sky-600 rounded-lg hover:bg-sky-50 transition-all duration-300 font-medium text-sm sm:text-base touch-manipulation"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
