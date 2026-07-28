import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SynapseCore Systems Version 2 is Almost Here',
  description: 'SynapseCore Systems Version 2 pre-launch countdown. Launching 1 August 2026.',
};

export default function PreLaunchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060914] text-white">
      {children}
    </div>
  );
}
