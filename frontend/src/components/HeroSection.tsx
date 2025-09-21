"use client";
import React, { useEffect, useState } from 'react';

interface ProfileData {
  user: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    linkedin_url?: string;
  };
  preferences: {
    keywords?: string[];
  };
}

export default function HeroSection({ isApiOk }: { isApiOk: boolean }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndProfile();
  }, []);

  const checkAuthAndProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    
    // Check profile completion
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProfileCompletionPercentage = () => {
    if (!profileData) return 0;
    
    const { user, preferences } = profileData;
    const fields = [
      user?.first_name,
      user?.last_name,
      user?.phone,
      user?.linkedin_url,
      preferences?.keywords?.length > 0
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const isProfileComplete = getProfileCompletionPercentage() >= 80; // Consider 80%+ as complete

  if (loading) {
    return (
      <section className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold">Find jobs that match your profile</h1>
        <p className="mt-2 text-blue-100 text-sm sm:text-base">Connect your LinkedIn, set keywords, and swipe to apply.</p>
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm">
          <div className="px-4 py-2 rounded bg-white/20 text-white/80 font-medium animate-pulse">
            Loading...
          </div>
          <span className={`sm:ml-auto inline-flex items-center gap-2 rounded-md px-3 py-1.5 ${isApiOk ? 'bg-white/20' : 'bg-red-600/70'}`}>
            <span className={`inline-block h-2 w-2 rounded-full ${isApiOk ? 'bg-emerald-300' : 'bg-white'}`}></span>
            <span className="text-xs">API: {isApiOk ? 'OK' : 'Down'}</span>
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-semibold">Find jobs that match your profile</h1>
      <p className="mt-2 text-blue-100 text-sm sm:text-base">Connect your LinkedIn, set keywords, and swipe to apply.</p>
      
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {!isAuthenticated ? (
            // Not logged in - show registration buttons
            <>
              <a 
                href="/register" 
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-white/90 text-blue-700 font-semibold hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get Started
              </a>
              <a 
                href="/login" 
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-white/60 text-white font-semibold hover:bg-white/10 hover:border-white/80 transition-all duration-200 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </a>
            </>
          ) : isProfileComplete ? (
            // Logged in with complete profile - show success status
            <>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-green-500/20 border border-green-400/30">
                <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-100 font-medium text-sm sm:text-base">Profile Complete!</span>
              </div>
              <a 
                href="/swipe" 
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Swiping
              </a>
              <a 
                href="/profile" 
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-white/60 text-white font-semibold hover:bg-white/10 hover:border-white/80 transition-all duration-200 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Edit Profile
              </a>
            </>
          ) : (
            // Logged in with incomplete profile - show completion status
            <>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl bg-yellow-500/20 border border-yellow-400/30">
                <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-yellow-100 font-medium text-sm sm:text-base">
                  Profile {getProfileCompletionPercentage()}% Complete
                </span>
              </div>
              <a 
                href="/profile" 
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Complete Profile
              </a>
            </>
          )}
        </div>
        
        <div className={`inline-flex items-center gap-2 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 ${isApiOk ? 'bg-white/20' : 'bg-red-600/70'} mt-4 sm:mt-0`}>
          <span className={`inline-block h-2 w-2 rounded-full ${isApiOk ? 'bg-emerald-300' : 'bg-white'}`}></span>
          <span className="text-xs sm:text-sm font-medium">API: {isApiOk ? 'OK' : 'Down'}</span>
        </div>
      </div>
    </section>
  );
}
