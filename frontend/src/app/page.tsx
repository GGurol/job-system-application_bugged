async function getHealth(): Promise<{ status: string } | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const res = await fetch(`${baseUrl}/health`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getPublicJobs(): Promise<{ id: number; title: string; company: string; location: string }[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const res = await fetch(`${baseUrl}/jobs/public-list?limit=5`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

import PublicJobs from '../components/PublicJobs';
import HeroSection from '../components/HeroSection';

export default async function Home() {
  const health = await getHealth();
  // CORRECTED: Check if the health object is not null,
  // instead of checking for a specific string value.
  const isOk = !!health;
  
  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <HeroSection isApiOk={isOk} />
      <div className="mt-6 sm:mt-8">
        <PublicJobs />
      </div>
      <footer className="mt-8 sm:mt-12 border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">CareerPilot - Navigate your career with confidence</footer>
    </main>
  );
}