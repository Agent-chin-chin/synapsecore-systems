'use client';

import { useEffect, useMemo, useState } from 'react';

function getCountdown(target: Date) {
  const now = Date.now();
  const diff = Math.max(target.getTime() - now, 0);

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  return { days, hours, minutes, seconds, complete: diff <= 0 };
}

export default function PreLaunchPage() {
  const targetDate = useMemo(
    () => new Date('2026-08-01T00:00:00+01:00'),
    []
  );
  const [countdown, setCountdown] = useState(() => getCountdown(targetDate));
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_30%)]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/60 px-4 py-3 shadow-xl shadow-cyan-500/10 backdrop-blur-sm">
            <img
              src="/logo.ico"
              alt="SynapseCore Systems logo"
              className="h-12 w-12 rounded-full border border-white/10 bg-white/5 p-2"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/90">SynapseCore Systems</p>
              <p className="text-base font-semibold text-slate-100">Version 2</p>
            </div>
          </div>

          <div className="space-y-4 px-4 sm:px-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
              SynapseCore Systems Version 2 is Almost Here
            </h1>
            <p className="mx-auto max-w-3xl text-base sm:text-lg leading-8 text-slate-300">
              We are putting the finishing touches on the next generation of SynapseCore Systems.
              Our team is completing final testing, security validation, and performance optimization to deliver a faster,
              smarter, and more secure experience. Thank you for your patience and continued support.
              We look forward to welcoming you on 1 August 2026.
            </p>
          </div>

          <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-4">
            {[
              { label: 'Days', value: countdown.days },
              { label: 'Hours', value: countdown.hours },
              { label: 'Minutes', value: countdown.minutes },
              { label: 'Seconds', value: countdown.seconds },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-slate-950/60 px-5 py-6 shadow-lg shadow-slate-950/20 backdrop-blur-md transition duration-500 hover:-translate-y-1"
              >
                <p className="text-5xl font-semibold text-white tracking-tight tabular-nums">
                  {value.toString().padStart(2, '0')}
                </p>
                <p className="mt-3 text-sm uppercase tracking-[0.24em] text-cyan-300/80">{label}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Launch target</p>
            <p className="mt-2 text-xl font-medium text-white">1 August 2026 • Africa/Lagos (WAT)</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-medium text-slate-300">Contact</p>
                <p className="mt-3 text-base text-white">support@synapsecoresystems.com</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-medium text-slate-300">Stay in touch</p>
                <p className="mt-3 text-base text-white">Follow us for launch updates and platform news.</p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label htmlFor="notify-email" className="sr-only">
                Notify me email
              </label>
              <input
                id="notify-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email for launch updates"
                className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Notify me
              </button>
            </div>
            {submitted && (
              <p className="mt-4 text-sm text-emerald-300">Thanks! We’ll let you know when Version 2 launches.</p>
            )}
          </form>

          <p className="mt-8 text-xs uppercase tracking-[0.32em] text-slate-500">
            © {new Date().getFullYear()} SynapseCore Systems. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
