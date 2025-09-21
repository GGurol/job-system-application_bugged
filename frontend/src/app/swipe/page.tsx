"use client";
import React, { useState } from 'react';
import JobSwiper from '../../components/JobSwiper';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

export default function SwipePage() {
  const [swipeStats, setSwipeStats] = useState({ passed: 0, applied: 0 });

  const handleSwipe = (jobId: string, action: 'swiped_left' | 'swiped_right') => {
    setSwipeStats(prev => ({
      ...prev,
      [action === 'swiped_left' ? 'passed' : 'applied']: prev[action === 'swiped_left' ? 'passed' : 'applied'] + 1
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Swipe Jobs
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Swipe right to apply, left to pass. We'll handle the applications for you!
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center space-x-6 mb-10 animate-slide-up">
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border border-red-200/50 dark:border-red-800/30 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{swipeStats.passed}</div>
                <div className="text-sm font-medium text-red-600/70 dark:text-red-400/70 uppercase tracking-wider">Passed</div>
              </div>
            </div>
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-950/30 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/30 hover:shadow-lg transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{swipeStats.applied}</div>
                <div className="text-sm font-medium text-green-600/70 dark:text-green-400/70 uppercase tracking-wider">Applied</div>
              </div>
            </div>
          </div>

          {/* Job Swiper */}
          <JobSwiper onSwipe={handleSwipe} />

          {/* Navigation */}
          <div className="mt-10 flex justify-center space-x-4 animate-fade-in">
            <Link href="/dashboard">
              <Button variant="outline" className="px-6 py-3 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/applications">
              <Button variant="outline" className="px-6 py-3 hover:bg-purple-50 dark:hover:bg-purple-950/50 border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Applications
              </Button>
            </Link>
          </div>

          {/* Tips */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-blue-950/20 dark:via-gray-900/50 dark:to-purple-950/20 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Tips for Success</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mt-2 flex-shrink-0"></div>
                <span className="text-sm text-muted-foreground">Make sure your CV is uploaded for automatic applications</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mt-2 flex-shrink-0"></div>
                <span className="text-sm text-muted-foreground">Update your profile with relevant keywords</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mt-2 flex-shrink-0"></div>
                <span className="text-sm text-muted-foreground">Check your applications page to track progress</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mt-2 flex-shrink-0"></div>
                <span className="text-sm text-muted-foreground">Be selective - quality over quantity leads to better matches</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
