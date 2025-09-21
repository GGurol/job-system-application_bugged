"use client";
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

type Application = {
  id: string;
  job_id: string;
  action: string;
  status: string;
  applied_at?: string;
  created_at: string;
  title: string;
  company: string;
  location?: string;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view applications');
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${baseUrl}/applications/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to load applications');
      const data = await res.json();
      setApplications(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'interviewing': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'swiped_right': return 'Applied';
      case 'swiped_left': return 'Passed';
      case 'applied': return 'Applied';
      default: return action;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading applications...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const appliedJobs = applications.filter(app => app.action === 'swiped_right' || app.action === 'applied');
  const passedJobs = applications.filter(app => app.action === 'swiped_left');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Applications</h1>
              <p className="text-muted-foreground">
                Track your job applications and their current status
              </p>
            </div>
            <Link href="/swipe">
              <Button>Find More Jobs</Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{appliedJobs.length}</div>
                <div className="text-sm text-muted-foreground">Applications Sent</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {appliedJobs.filter(app => app.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending Response</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {appliedJobs.filter(app => app.status === 'interviewing').length}
                </div>
                <div className="text-sm text-muted-foreground">Interviews</div>
              </div>
            </Card>
          </div>

          {/* Applications List */}
          <div className="space-y-6">
            {appliedJobs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Applied Jobs ({appliedJobs.length})</h2>
                <div className="space-y-3">
                  {appliedJobs.map((app) => (
                    <Card key={app.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold">{app.title}</h3>
                              <p className="text-muted-foreground">
                                {app.company}
                                {app.location && ` • ${app.location}`}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Applied on {new Date(app.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {passedJobs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Passed Jobs ({passedJobs.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {passedJobs.slice(0, 6).map((app) => (
                    <Card key={app.id} className="p-3">
                      <div className="text-sm">
                        <div className="font-medium">{app.title}</div>
                        <div className="text-muted-foreground">{app.company}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Passed on {new Date(app.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Card>
                  ))}
                  {passedJobs.length > 6 && (
                    <Card className="p-3 flex items-center justify-center">
                      <div className="text-sm text-muted-foreground">
                        +{passedJobs.length - 6} more
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {applications.length === 0 && (
              <Card className="p-8 text-center">
                <div className="space-y-4">
                  <div className="text-4xl">📄</div>
                  <div>
                    <h3 className="text-lg font-medium">No applications yet</h3>
                    <p className="text-muted-foreground">
                      Start swiping on jobs to see your applications here
                    </p>
                  </div>
                  <Link href="/swipe">
                    <Button>Start Swiping</Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
