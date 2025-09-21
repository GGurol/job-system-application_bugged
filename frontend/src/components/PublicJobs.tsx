"use client";
import React, { useEffect, useState } from 'react';
import JobCard from './JobCard';

type Job = { id: string; title: string; company: string; location?: string };

export default function PublicJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    try {
      const res = await fetch(`${baseUrl}/jobs/public-list?limit=8`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Latest jobs</h2>
        <button 
          onClick={load} 
          className="text-sm px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium self-start sm:self-auto"
        >
          Refresh
        </button>
      </div>
      {loading && <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading jobs...</p>}
      {error && <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">{error}</p>}
      {!loading && !error && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map(j => (
            <JobCard key={j.id} title={j.title} company={j.company} location={j.location} />
          ))}
          {jobs.length === 0 && <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base col-span-full">No jobs available.</p>}
        </div>
      )}
    </div>
  );
}


