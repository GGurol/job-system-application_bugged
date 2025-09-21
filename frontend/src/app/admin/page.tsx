"use client";
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have a textarea component

export default function AdminPage() {
  const [stats, setStats] = useState<{ jobs: number; last_added: string } | null>(null);
  const [loadingScrape, setLoadingScrape] = useState(false);
  const [keywords, setKeywords] = useState('software engineer');
  const [location, setLocation] = useState('United States');
  
  // State for the new job form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    application_url: '',
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const loadStats = async () => {
    if (!token) return;
    const res = await fetch(`${baseUrl}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setStats(await res.json());
  };

  useEffect(() => { loadStats(); }, []);

  const runScrape = async () => {
    if (!token) { alert('Login first'); return; }
    setLoadingScrape(true);
    await fetch(`${baseUrl}/admin/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ keywords, location })
    });
    setLoadingScrape(false);
    setTimeout(loadStats, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { alert('Login first'); return; }

    try {
      const res = await fetch(`${baseUrl}/admin/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newJob)
      });

      if (!res.ok) {
        throw new Error('Failed to create job');
      }

      alert('Job created successfully!');
      setIsModalOpen(false); // Close the modal on success
      loadStats(); // Refresh stats
    } catch (error) {
      console.error(error);
      alert('Error creating job. See console for details.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      {/* Stats Section */}
      <div className="grid sm:grid-cols-3 gap-3">
        {/* ... stats cards ... */}
      </div>

        

      {/* ADDED: Manual Job Posting Section */}
      <div className="border rounded p-4 bg-white">
        <h2 className="text-lg font-medium mb-3">Manual Job Posting</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Add New Job</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleJobSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input id="title" name="title" value={newJob.title} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">Company</Label>
                <Input id="company" name="company" value={newJob.company} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input id="location" name="location" value={newJob.location} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="application_url" className="text-right">Apply URL</Label>
                <Input id="application_url" name="application_url" value={newJob.application_url} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" value={newJob.description} onChange={handleInputChange} className="col-span-3" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Job</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}