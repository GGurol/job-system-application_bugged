"use client";
import React, { useEffect, useState } from 'react';

export default function Navbar(){
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  useEffect(() => {
    setIsAuthed(!!localStorage.getItem('token'));
    
    // Check initial dark mode preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(initialDark);
    updateTheme(initialDark);
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      setIsAuthed(!!localStorage.getItem('token'));
    };
    
    window.addEventListener('authStateChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, []);

  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    updateTheme(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthed(false);
    window.dispatchEvent(new Event('authStateChange'));
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <nav className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 min-w-0 w-full gap-2">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                {/* Professional Career Navigation Icon */}
                <defs>
                  <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"currentColor", stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"currentColor", stopOpacity:0.8}} />
                  </linearGradient>
                </defs>
                {/* Outer circle */}
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
                {/* Navigation arrow pointing up-right (career growth) */}
                <path d="M8 16L12 8L16 16L14 14L12 12L10 14L8 16Z" fill="url(#navGradient)" opacity="0.9"/>
                {/* Success indicator dot */}
                <circle cx="12" cy="6" r="1.5" fill="currentColor" opacity="0.8"/>
                {/* Career path lines */}
                <path d="M12 8L12 10M12 14L12 16M8 12L10 12M14 12L16 12" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                {/* Center focus point */}
                <circle cx="12" cy="12" r="1" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CareerPilot
            </span>
          </a>

          {/* Desktop Navigation - Hidden below 576px */}
          <div className="hidden min-[576px]:flex items-center space-x-8 flex-1 justify-center">
            {/* Main Navigation */}
            <div className="flex items-center space-x-6">
              {isAuthed === null ? (
                <>
                  {/* Navigation placeholders */}
                  <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                </>
              ) : (
                <>
                  <a 
                    href="/" 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group whitespace-nowrap"
                  >
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                  <a 
                    href="/profile" 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group whitespace-nowrap"
                  >
                    Profile
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                </>
              )}
              {isAuthed && (
                <>
                  <a 
                    href="/dashboard" 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group whitespace-nowrap"
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                  <a 
                    href="/swipe" 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group whitespace-nowrap"
                  >
                    Find Jobs
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                  <a 
                    href="/applications" 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 relative group whitespace-nowrap"
                  >
                    Applications
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                </>
              )}
            </div>

            {/* Dark Mode Toggle - Hidden below 657px */}
            {isAuthed === null ? (
              <div className="hidden min-[657px]:block w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg flex-shrink-0"></div>
            ) : (
              <button
                onClick={toggleDarkMode}
                className="hidden min-[657px]:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group border border-transparent hover:border-gray-200 dark:hover:border-gray-600 flex-shrink-0"
                aria-label="Toggle dark mode"
              >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              </button>
            )}

            {/* Auth Buttons - Logout hidden below 771px */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {isAuthed === null ? (
                <div className="flex items-center space-x-3">
                  {/* Auth buttons placeholder */}
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
                  <div className="w-20 h-8 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse rounded-lg shadow-md"></div>
                </div>
              ) : isAuthed ? (
                <button 
                  onClick={logout} 
                  className="hidden min-[771px]:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              ) : (
                <>
                  <a 
                    href="/login" 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 whitespace-nowrap"
                  >
                    Login
                  </a>
                  <a 
                    href="/register" 
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Get Started
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button - Shows below 576px */}
          <div className="min-[576px]:hidden flex items-center space-x-1 sm:space-x-2">
            {/* Dark Mode Toggle for Mobile */}
            {isAuthed !== null && (
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Menu Dropdown - Shows below 576px */}
        {isMobileMenuOpen && (
          <div className="min-[576px]:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg animate-slide-down">
            <div className="px-4 py-4 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-3">
                {isAuthed === null ? (
                  <>
                    {/* Navigation placeholders */}
                    <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                    <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
                  </>
                ) : (
                  <>
                    <a 
                      href="/" 
                      className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </a>
                    <a 
                      href="/profile" 
                      className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </a>
                  </>
                )}
                {isAuthed && (
                  <>
                    <a 
                      href="/dashboard" 
                      className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </a>
                    <a 
                      href="/swipe" 
                      className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Find Jobs
                    </a>
                    <a 
                      href="/applications" 
                      className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Applications
                    </a>
                  </>
                )}
              </div>

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {isAuthed === null ? (
                  <div className="space-y-3">
                    {/* Auth buttons placeholder */}
                    <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
                    <div className="w-24 h-10 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse rounded-lg shadow-md"></div>
                  </div>
                ) : isAuthed ? (
                  <button 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                ) : (
                  <div className="space-y-3">
                    <a 
                      href="/login" 
                      className="block text-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-3 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </a>
                    <a 
                      href="/register" 
                      className="block w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get Started
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
