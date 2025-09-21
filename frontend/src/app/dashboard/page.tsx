"use client";
import React, { useEffect, useState } from 'react';

type Job = { id: number; title: string; company: string; location: string; created_at?: string };

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setError('Not authenticated'); setLoading(false); return; }
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      try {
        const res = await fetch(`${baseUrl}/jobs/matches`, {
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
    fetchJobs();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <ul className="space-y-2">
          {jobs.map((j) => (
            <li key={j.id} className="border rounded p-3">
              <div className="font-medium">{j.title}</div>
              <div className="text-sm text-gray-600">{j.company} — {j.location}</div>
            </li>
          ))}
          {jobs.length === 0 && <li className="text-gray-600">No jobs yet.</li>}
        </ul>
      )}
    </div>
  );
}
