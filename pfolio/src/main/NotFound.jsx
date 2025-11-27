import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-500 leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-300 text-lg sm:text-xl mb-6">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Animated Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center animate-pulse">
            <svg 
              className="w-12 h-12 sm:w-16 sm:h-16 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.002-5.824-2.709M15 17H9v-2.5A5.5 5.5 0 0114.5 9h1A2.5 2.5 0 0118 11.5v1.709z" 
              />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link 
            to="/" 
            className="block w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Go Home
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="block w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Go Back
          </button>
        </div>

        {/* Suggestion Links */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <Link 
              to="/about" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base"
            >
              About
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              to="/projects" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base"
            >
              Projects
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              to="/skills" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base"
            >
              Skills
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              to="/contact" 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
