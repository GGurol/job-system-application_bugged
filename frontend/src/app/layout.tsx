import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'CareerPilot',
  description: 'Navigate your career with intelligent job matching and automated applications',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="transition-colors duration-300">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
