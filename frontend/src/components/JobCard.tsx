import React from 'react';

type JobCardProps = {
  title: string;
  company: string;
  location?: string | null;
  createdAt?: string | null;
};

export default function JobCard({ title, company, location, createdAt }: JobCardProps){
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">{company}{location ? ` — ${location}` : ''}</p>
        </div>
        {createdAt && <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">{new Date(createdAt).toLocaleDateString()}</span>}
      </div>
    </div>
  );
}
