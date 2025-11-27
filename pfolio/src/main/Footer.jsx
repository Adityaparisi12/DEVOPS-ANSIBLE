import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white via-sky-50 to-sky-100 border-t border-sky-200/50 lg:ml-64 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About Section - Sky Blue & Black Theme */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 via-sky-600 to-black rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">SL</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">Sai Laxman Rao</h3>
            </div>
            
            <p className="text-gray-800 leading-relaxed text-base font-medium">
              Full-Stack Developer passionate about creating <span className="text-sky-700 font-bold">meaningful digital experiences</span>. 
              Building <span className="text-black font-bold">scalable solutions</span> with clean code and modern technologies.
            </p>
            
            {/* Social Links - Sky Blue Theme */}
            <div className="flex items-center space-x-3">
              <a
                href="https://github.com/2300090230/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-black hover:to-gray-800 rounded-lg transition-all duration-300"
                aria-label="GitHub Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              
              <a
                href="https://www.linkedin.com/in/sailaxmanrao-kothakota-2b0b1a1b6/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-sky-600 hover:to-sky-700 rounded-lg transition-all duration-300"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              
              <a
                href="mailto:2300090230csit@gmail.com"
                className="p-2 text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-sky-600 hover:to-sky-700 rounded-lg transition-all duration-300"
                aria-label="Send Email"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links - Black & Sky Blue Theme */}
          <div className="space-y-4">
            <h4 className="text-xl font-black bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About' },
                { href: '/skills', label: 'Skills' },
                { href: '/projects', label: 'Projects' },
                { href: '/certifications', label: 'Certifications' },
                { href: '/youtube', label: 'YouTube' },
                { href: '/contact', label: 'Contact' },
                { href: '/admin/login', label: 'Laxman' }
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-800 hover:text-sky-700 text-base py-1 transition-colors duration-300 hover:font-bold font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info - Sky Blue Theme */}
          <div className="space-y-4">
            <h4 className="text-xl font-black bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">Get in Touch</h4>
            
            <div className="space-y-3 text-base">
              <div className="text-gray-800 font-medium">
                <span className="font-bold text-sky-700">Email:</span> 2300090230csit@gmail.com
              </div>
              
              <div className="text-gray-800 font-medium">
                <span className="font-bold text-sky-700">Location:</span> Visakhapatnam, India
              </div>
            </div>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 via-sky-600 to-black hover:from-black hover:to-sky-600 text-white rounded-lg text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>Let's Connect</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Section - Sky Blue & Black Theme */}
        <div className="mt-8 pt-6 border-t border-sky-200/50">
          <div className="text-center space-y-2">
            <div className="text-gray-700 text-sm">
              © 2025 <span className="font-semibold bg-gradient-to-r from-black to-sky-700 bg-clip-text text-transparent">Sai Laxman Rao</span>. All rights reserved.
            </div>
            
            <div className="flex items-center justify-center gap-2 text-gray-700 text-sm">
              <span>Made with</span>
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button - Sky Blue Theme */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 bg-gradient-to-r from-sky-500 via-sky-600 to-black hover:from-black hover:to-sky-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;