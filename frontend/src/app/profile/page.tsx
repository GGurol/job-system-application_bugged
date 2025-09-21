"use client";
import React, { useEffect, useState } from 'react';
import FileUpload from '../../components/FileUpload';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [keywords, setKeywords] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) { 
      setError('Not authenticated'); 
      setLoading(false); 
      return; 
    }
    
    try {
      const res = await fetch(`${baseUrl}/profile/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to load profile');
      
      const data = await res.json();
      setLinkedinUrl(data?.user?.linkedin_url || '');
      setFirstName(data?.user?.first_name || '');
      setLastName(data?.user?.last_name || '');
      setPhone(data?.user?.phone || '');
      
      const kws = (data?.preferences?.keywords || []).join(', ');
      setKeywords(kws);
    } catch (e: any) {
      setError(e.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setSaving(false);
      return;
    }
    
    try {
      const kwArray = keywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);
        
      // Update user info
      const userRes = await fetch(`${baseUrl}/profile/me`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          linkedinUrl, 
          firstName, 
          lastName, 
          phone 
        })
      });
      
      if (!userRes.ok) {
        const errorData = await userRes.json();
        throw new Error(errorData.error || 'Failed to update user info');
      }
      
      // Update preferences
      const prefRes = await fetch(`${baseUrl}/profile/preferences`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ keywords: kwArray })
      });
      
      if (!prefRes.ok) {
        const errorData = await prefRes.json();
        throw new Error(errorData.error || 'Failed to update preferences');
      }
      
      setSuccess(cvUploaded ? 'Profile and CV updated successfully! 🎉' : 'Profile updated successfully!');
    } catch (e: any) {
      setError(e.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadSuccess = (fileId: string) => {
    setError(null);
    setCvUploaded(true);
    setSuccess('CV uploaded successfully! Your profile is now complete. 📄✨');
  };

  const handleUploadError = (error: string) => {
    setSuccess(null);
    setCvUploaded(false);
    setError(error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="text-lg font-medium text-muted-foreground">Loading your profile...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete your profile to unlock personalized job recommendations and automatic applications
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Profile Completion</span>
              <span className="text-sm font-semibold text-primary">
                {Math.round(((firstName ? 1 : 0) + (lastName ? 1 : 0) + (phone ? 1 : 0) + (linkedinUrl ? 1 : 0) + (keywords ? 1 : 0) + (cvUploaded ? 1 : 0)) / 6 * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((firstName ? 1 : 0) + (lastName ? 1 : 0) + (phone ? 1 : 0) + (linkedinUrl ? 1 : 0) + (keywords ? 1 : 0) + (cvUploaded ? 1 : 0)) / 6 * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-xl p-4 flex items-center space-x-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-xl p-4 flex items-center space-x-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-xl">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Personal Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name</label>
                      <input 
                        value={firstName} 
                        onChange={e => setFirstName(e.target.value)} 
                        className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        placeholder="John" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name</label>
                      <input 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)} 
                        className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                        placeholder="Doe" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
                    <input 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      placeholder="+1 (555) 123-4567" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">LinkedIn Profile</label>
                    <input 
                      value={linkedinUrl} 
                      onChange={e => setLinkedinUrl(e.target.value)} 
                      className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                      placeholder="https://www.linkedin.com/in/your-handle" 
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Job Preferences */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-xl">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V6zM8 6v10h8V6" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Job Preferences</h2>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Skills & Keywords</label>
                  <textarea 
                    value={keywords} 
                    onChange={e => setKeywords(e.target.value)} 
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-none" 
                    placeholder="react, node.js, typescript, python, full-stack, remote work, startup" 
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    💡 Add skills, technologies, job types, and preferences separated by commas. This helps us find the perfect job matches for you!
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* CV Upload */}
          <FileUpload 
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />

          {/* Save Button */}
          <div className="flex justify-center">
            <Button 
              onClick={save} 
              disabled={saving}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
