import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../contextapi/AuthContext';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const { setIsAdminLoggedIn } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${config.url}/admin/checkadminlogin`, formData, {
        timeout: 30000, // Extended timeout for hosted backend
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // If login is successful (HTTP 200), proceed
      if (response.status === 200) {
        setLoginSuccess(true);
        setIsAdminLoggedIn(true);
        
        // Delay navigation to show success state
        setTimeout(() => {
          navigate('/');
        }, 2000); // Increased delay slightly for better UX
      }
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Login timeout. The hosted backend may be starting up (this is normal for free hosting). Please wait 30 seconds and try again.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Invalid credentials. Please try again.';
            break;
          case 404:
            errorMessage = 'Admin login endpoint not found. Please check backend server.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Login failed with status: ${err.response.status}`;
        }
      }
      
      setError(errorMessage);
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  // Show fullscreen loading state when either loading or login is successful
  if (loading || loginSuccess) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-white via-sky-50 to-sky-100 flex flex-col items-center justify-center z-50 px-4">
        {/* Main loading spinner - Sky Blue Theme */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin mb-6 sm:mb-8"></div>
        
        {/* Skeleton loading UI - Sky Blue Theme */}
        <div className="w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl animate-pulse">
          {/* Header skeleton */}
          <div className="hidden md:flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-sky-100 rounded-lg animate-pulse"></div>
            <div className="h-5 lg:h-6 bg-sky-100 rounded w-32 sm:w-40 lg:w-48 animate-pulse"></div>
            <div className="flex-1"></div>
            <div className="h-6 lg:h-8 bg-sky-100 rounded w-20 lg:w-24 animate-pulse"></div>
          </div>
          
          {/* Mobile header skeleton */}
          <div className="md:hidden flex flex-col items-center space-y-3 mb-6">
            <div className="w-12 h-12 bg-sky-100 rounded-lg animate-pulse"></div>
            <div className="h-5 bg-sky-100 rounded w-40 animate-pulse"></div>
          </div>
          
          {/* Main content skeleton */}
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            {/* Sidebar skeleton */}
            <div className="w-full md:w-64 md:flex-shrink-0">
              <div className="h-6 lg:h-8 bg-sky-100 rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-0 md:space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 lg:h-8 bg-sky-100 rounded w-full animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Main content area skeleton */}
            <div className="flex-1">
              <div className="h-8 lg:h-10 bg-sky-100 rounded w-full sm:w-2/3 lg:w-1/3 mb-4 lg:mb-6 animate-pulse"></div>
              
              {/* Text content skeleton */}
              <div className="space-y-3 mb-4 lg:mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-3 lg:h-4 bg-sky-100 rounded w-full animate-pulse"></div>
                ))}
                <div className="h-3 lg:h-4 bg-sky-100 rounded w-5/6 animate-pulse"></div>
              </div>
              
              {/* Card grid skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div className="h-24 sm:h-28 lg:h-32 bg-sky-100 rounded animate-pulse"></div>
                <div className="h-24 sm:h-28 lg:h-32 bg-sky-100 rounded animate-pulse"></div>
              </div>
              
              {/* More text content skeleton */}
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-3 lg:h-4 bg-sky-100 rounded w-full animate-pulse"></div>
                ))}
                <div className="h-3 lg:h-4 bg-sky-100 rounded w-4/5 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading message with pulsing animation - Sky Blue Theme */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-sm sm:text-base text-sky-600 font-medium animate-pulse px-4">
            {loginSuccess ? 'Logging in to admin panel...' : 'Authenticating...'}
          </p>
          <div className="flex items-center justify-center mt-3 sm:mt-4 space-x-1">
            <div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-sky-50 to-sky-100 px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-lg border border-sky-200/50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-sky-500 via-sky-600 to-black rounded-lg flex items-center justify-center shadow-md mb-3 sm:mb-4">
            <span className="text-white font-bold text-lg sm:text-xl">SL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">Admin Login</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Sign in to access the admin panel</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base bg-white/70 backdrop-blur-sm"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base bg-white/70 backdrop-blur-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3 sm:space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-sky-500 via-sky-600 to-black text-white rounded-lg hover:from-sky-600 hover:via-sky-700 hover:to-black transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center text-sm sm:text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <Link
              to="/"
              className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 border border-sky-500 text-sky-600 rounded-lg hover:bg-gradient-to-r hover:from-sky-50 hover:to-sky-100 transition-all duration-300 font-medium text-center text-sm sm:text-base ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              Back to Portfolio
            </Link>
          </div>
        </form>

        <div className="text-center text-xs sm:text-sm text-gray-600 pt-3 sm:pt-4 border-t border-sky-200/50 mt-4 sm:mt-6">
          <p>
            Protected access for administrative purposes only.
          </p>
        </div>
      </div>
    </div>
  );

}