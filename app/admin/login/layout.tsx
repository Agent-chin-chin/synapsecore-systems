import type { ReactNode } from 'react';

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
