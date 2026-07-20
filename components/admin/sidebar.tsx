import Link from 'next/link';

const navGroups = [
  {
    title: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
      { href: '/admin/incidents', label: 'Incidents', icon: '⚠️' },
      { href: '/admin/incident-timeline', label: 'Incident Timeline', icon: '📅' },
      { href: '/admin/threat-feed', label: 'Threat Feed', icon: '🔴' },
      { href: '/admin/notifications', label: 'Notifications', icon: '🔔' },
      { href: '/admin/support', label: 'Support', icon: '💬' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { href: '/admin/users', label: 'Users', icon: '👥' },
      { href: '/admin/learners', label: 'Learners', icon: '🎓' },
      { href: '/admin/courses', label: 'Courses', icon: '📚' },
      { href: '/admin/cms', label: 'Course CMS', icon: '🛠️' },
      { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
      { href: '/admin/resources', label: 'Resources', icon: '📁' },
      { href: '/admin/faq', label: 'FAQ', icon: '❓' },
      { href: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
      { href: '/admin/customer-stories', label: 'Customer Stories', icon: '📖' },
      { href: '/admin/changelogs', label: 'Changelogs', icon: '📝' },
    ],
  },
  {
    title: 'Platform',
    items: [
      { href: '/admin/reports', label: 'Reports', icon: '📈' },
      { href: '/admin/custom-reports', label: 'Custom Reports', icon: '📊' },
      { href: '/admin/integrations', label: 'Integrations', icon: '🔗' },
      { href: '/admin/webhooks', label: 'Webhooks', icon: '🌐' },
      { href: '/admin/api-keys', label: 'API Keys', icon: '🔑' },
      { href: '/admin/audit-logs', label: 'Audit Logs', icon: '📋' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/roles', label: 'Roles', icon: '🛡️' },
      { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
      { href: '/admin/sso', label: 'SSO', icon: '🔒' },
      { href: '/admin/status', label: 'Status', icon: '💡' },
    ],
  },
];

export default function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={`${className} flex min-h-screen flex-col bg-slate-950 text-slate-100`}>
      <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-cyan-500 text-lg font-semibold text-slate-950">
          SC
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-400">SynapseCore</p>
          <p className="text-xs text-slate-500">Admin workspace</p>
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
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 px-6 py-5 text-xs text-slate-500">
        <p>Version 1.0.0</p>
        <p className="mt-2 text-slate-400">Secure admin experience</p>
      </div>
    </aside>
  );
}
