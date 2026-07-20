import Link from 'next/link';
import { motion } from 'framer-motion';

interface ComingSoonCardProps {
  title: string;
  description: string;
  version?: string;
  features?: string[];
  backHref?: string;
  browseHref?: string;
  accent?: string;
  className?: string;
}

export default function ComingSoonCard({
  title,
  description,
  version = 'Available in v1.1',
  features = [],
  backHref = '/learner/dashboard',
  browseHref = '/learner/courses',
  accent = 'from-cyan-500 to-blue-500',
  className = '',
}: ComingSoonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl ${className}`}
    >
      <div className={`inline-flex rounded-2xl bg-gradient-to-r ${accent} p-3 text-2xl text-white`}>
        🚧
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-300">
          {version}
        </span>
      </div>

      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">{description}</p>

      {features.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Planned for launch</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={backHref}
          className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-white"
        >
          Back to Dashboard
        </Link>
        <Link
          href={browseHref}
          className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Browse Courses
        </Link>
      </div>
    </motion.div>
  );
}
