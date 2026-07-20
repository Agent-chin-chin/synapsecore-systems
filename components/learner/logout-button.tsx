'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect to login page
        router.push('/learner/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-red-950 hover:text-red-300 disabled:opacity-50"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-900 text-slate-300">
        🚪
      </span>
      <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
    </button>
  );
}
