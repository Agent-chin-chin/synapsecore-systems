import Link from 'next/link';
import LogoutButton from './logout-button';

const navGroups = [
  {
    title: 'Learning',
    items: [
      { href: '/learner/dashboard', label: 'Dashboard', icon: '📊' },
      { href: '/learner/courses', label: 'Courses', icon: '📚' },
      { href: '/learner/my-courses', label: 'My Courses', icon: '🎓' },
      { href: '/learner/progress', label: 'Progress', icon: '📈' },
    ],
  },
  {
    title: 'Account',
    items: [
      { href: '/learner/profile', label: 'Profile', icon: '👤' },
      { href: '/learner/certificates', label: 'Certificates', icon: '🏆', badge: 'Coming Soon' },
      { href: '/learner/learning-paths', label: 'Learning Paths', icon: '🗺️', badge: 'v1.1' },
      { href: '/learner/settings', label: 'Settings', icon: '⚙️' },
    ],
  },
  {
    title: 'Community',
    items: [
      { href: '/learner/community', label: 'Community', icon: '👥', badge: 'Coming Soon' },
      { href: '/learner/support', label: 'Support', icon: '💬' },
      { href: '/learner/resources', label: 'Resources', icon: '📖', badge: 'v1.1' },
      { href: '/learner/assessments', label: 'Assessments', icon: '✍️', badge: 'v1.1' },
    ],
  },
];

export default function LearnerSidebar({ className }: { className?: string }) {
  return (
    <aside className={`${className} flex min-h-screen flex-col bg-slate-950 text-slate-100`}>
      <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-emerald-500 text-lg font-semibold text-slate-950">
          LC
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">SynapseCore</p>
          <p className="text-xs text-slate-500">Learning Academy</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {group.title}
            </p>
            <div className="space-y-2">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-900 text-slate-300">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span className="ml-auto rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 px-4 py-5">
        <LogoutButton />
        <div className="mt-4 border-t border-slate-800 px-2 py-4 text-xs text-slate-500">
          <p>Learner Academy</p>
          <p className="mt-2 text-slate-400">Cybersecurity Training</p>
        </div>
      </div>
    </aside>
  );
}
