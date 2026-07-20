import Link from "next/link";
import { ShieldCheck, BookOpen, Cpu, GraduationCap } from "lucide-react";

export default function TrainingPromo() {
  return (
    <section id="training" className="border-t border-white/10 bg-slate-900/80 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.55fr_0.45fr] items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Training & Certification
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Build modern capability with enterprise-ready cybersecurity and AI training.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
              Equip your technical and leadership teams with tailored programs, hands-on labs, and certification paths designed for long-term resilience.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                Book Training Review
              </Link>
              <Link href="/services/team-training" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-7 py-3 text-sm font-medium text-white transition hover:border-cyan-300">
                View Programs
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: ShieldCheck,
                title: "Security labs",
                detail: "Simulated exercises for real-world threat readiness.",
                accent: "from-emerald-400 to-teal-500",
              },
              {
                icon: BookOpen,
                title: "Certification tracks",
                detail: "Role-based learning for developers, ops, and CISOs.",
                accent: "from-cyan-400 to-sky-500",
              },
              {
                icon: Cpu,
                title: "AI upskilling",
                detail: "Practical automation and integration training.",
                accent: "from-indigo-400 to-violet-500",
              },
              {
                icon: GraduationCap,
                title: "Continuous refresh",
                detail: "Curriculum updates reflect current attack surfaces.",
                accent: "from-green-400 to-emerald-500",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-white/10 bg-[#070b14]/90 p-6 text-slate-300 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[0_20px_50px_rgba(8,15,35,0.35)]"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-lg shadow-cyan-500/10 transition group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
