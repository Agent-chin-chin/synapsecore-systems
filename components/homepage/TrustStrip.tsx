import { ShieldCheck, Sparkles, Clock3, Award, Server } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Enterprise-safe",
    description: "SOC 2 compliant with zero-breach track record across 120+ clients.",
    accent: "text-green-400",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Reduce incident response time to 18 minutes vs 4+ hours industry average.",
    accent: "text-cyan-400",
  },
  {
    icon: Clock3,
    title: "24/7 Response",
    description: "15-minute SLA for critical incidents, 24/7/365 monitoring.",
    accent: "text-blue-400",
  },
  {
    icon: Award,
    title: "Certified Experts",
    description: "CISSP, OSCP, AWS-certified engineers with 15+ years combined experience.",
    accent: "text-amber-400",
  },
  {
    icon: Server,
    title: "99.9% Uptime",
    description: "Mission-critical infrastructure with guaranteed deployment success.",
    accent: "text-emerald-400",
  },
];

export default function TrustStrip() {
  return (
    <section className="border-t border-green-400/20 bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-green-400/20 bg-gray-800 p-5 text-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-400/40 hover:shadow-[0_10px_30px_rgba(34,197,94,0.15)]"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center ${item.accent} transition group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-white">{item.title}</span>
                </div>
                <p className="mt-3 leading-6 text-gray-400">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
