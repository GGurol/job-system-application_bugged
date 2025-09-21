import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        // Add more colors as needed
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text-color)',
            // Add more typography settings as needed
          },
        },
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius)',
        // Add more border radius values as needed
      },
      spacing: {
        // Define custom spacing scale
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        // Add more spacing values as needed
      },
    },
  },
  plugins: [
    require('shadcn/ui/plugin'),
    // Add more plugins as needed
  ],
};

export default config;