'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for saved preference, or use system preference
    const savedPreference = localStorage.getItem('theme');
    if (savedPreference) {
      setIsDarkMode(savedPreference === 'dark');
    } else {
      // Check system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Update theme on mount and when system preference changes
  useEffect(() => {
    const updateTheme = () => {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Save preference to localStorage
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    };

    updateTheme();

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Only update if no saved preference exists
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(mediaQuery.matches);
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isDarkMode]);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
    // Force update theme immediately
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="text-xl">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
    </button>
  );
}