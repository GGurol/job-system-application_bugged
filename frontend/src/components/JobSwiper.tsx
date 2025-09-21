"use client";
import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';

type Job = {
  id: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
  application_url?: string;
  salary_min?: number;
  salary_max?: number;
  created_at?: string;
};

type JobSwiperProps = {
  onSwipe?: (jobId: string, action: 'swiped_left' | 'swiped_right') => void;
};

export default function JobSwiper({ onSwipe }: JobSwiperProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view jobs');
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/jobs/list?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to load jobs');
      const data = await res.json();
      setJobs(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action: 'swiped_left' | 'swiped_right') => {
    const currentJob = jobs[currentIndex];
    if (!currentJob) return;

    try {
      const token = localStorage.getItem('token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      await fetch(`${baseUrl}/jobs/swipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: currentJob.id, action }),
      });

      onSwipe?.(currentJob.id, action);
      setCurrentIndex(prev => prev + 1);
    } catch (e) {
      console.error('Failed to record swipe:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (currentIndex >= jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center animate-scale-in">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Great Job!</h3>
            <p className="text-lg font-medium text-muted-foreground">You've reviewed all available jobs</p>
          </div>
        </div>
        <Button 
          onClick={() => { setCurrentIndex(0); loadJobs(); }} 
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Load More Jobs
        </Button>
      </div>
    );
  }

  const currentJob = jobs[currentIndex];

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      {/* Progress indicator */}
      <div className="mb-6 flex items-center justify-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <span className="text-sm font-medium text-muted-foreground">
            {currentIndex + 1} of {jobs.length}
          </span>
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
        </div>
      </div>
      
      {/* Job Card */}
      <Card className="p-0 mb-8 min-h-[500px] relative overflow-hidden animate-scale-in shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30">
        {/* Card Header with Gradient */}
        <div className="relative p-6 pb-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
          <div className="relative space-y-2">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse"></div>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Featured Job</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent leading-tight">
              {currentJob.title}
            </h2>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{currentJob.company}</p>
            {currentJob.location && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">{currentJob.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-6">
          {(currentJob.salary_min || currentJob.salary_max) && (
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border border-green-200/50 dark:border-green-800/30">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800/50">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">Salary Range</span>
                <p className="font-bold text-green-700 dark:text-green-300">
                  {currentJob.salary_min && currentJob.salary_max
                    ? `${currentJob.salary_min.toLocaleString()} - ${currentJob.salary_max.toLocaleString()}`
                    : currentJob.salary_min
                    ? `${currentJob.salary_min.toLocaleString()}+`
                    : `Up to ${currentJob.salary_max?.toLocaleString()}`}
                </p>
              </div>
            </div>
          )}

          {currentJob.description && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Job Description</h3>
              </div>
              <div className="pl-4 border-l-2 border-gradient-to-b from-blue-100 to-purple-100 dark:border-gray-700">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
                  {currentJob.description}
                </p>
              </div>
            </div>
          )}

          {currentJob.application_url && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <a
                href={currentJob.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
              >
                <span>View Original Posting</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-6 mb-6">
        <Button
          onClick={() => handleSwipe('swiped_left')}
          variant="outline"
          size="lg"
          className="group relative w-32 h-14 text-red-600 border-2 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-300 transform hover:scale-105 btn-hover"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-semibold">Pass</span>
          </div>
        </Button>
        <Button
          onClick={() => handleSwipe('swiped_right')}
          size="lg"
          className="group relative w-32 h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 btn-hover"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">Apply</span>
          </div>
        </Button>
      </div>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center space-x-2">
          <span>Swipe left to pass, right to apply</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
            <div className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </p>
      </div>
    </div>
  );
}
