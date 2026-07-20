import { BookOpen, Cpu, ShieldCheck, Layers } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const services = [
  {
    title: "AI Automation",
    description: "Design, deploy, and govern intelligent systems that automate workflows and optimize outcomes.",
    icon: Cpu,
    accent: "from-cyan-400 to-sky-500",
    href: "/services/ai-automation",
  },
  {
    title: "Cybersecurity",
    description: "Protect digital assets with threat-aware engineering, detection, and response operations.",
    icon: ShieldCheck,
    accent: "from-emerald-400 to-lime-400",
    href: "/services/cybersecurity",
  },
  {
    title: "Web Development",
    description: "Build premium enterprise portals, customer experiences, and integration-ready platforms.",
    icon: Layers,
    accent: "from-indigo-400 to-violet-500",
    href: "/services/web-dev",
  },
  {
    title: "Training & Certification",
    description: "Empower teams with technical learning paths, certifications, and hands-on cyber exercises.",
    icon: BookOpen,
    accent: "from-sky-400 to-cyan-400",
    href: "/services/team-training",
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Animated background mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Core Services
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Enterprise service blocks designed for modern teams.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-400">
              Four strategic service areas with clear value for security, automation, engineering delivery, and workforce readiness.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={service.title} delay={index * 0.1} direction="up">
                <article
                  className="group rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-glow transition-all duration-500 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-slate-900/90 relative overflow-hidden"
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-b from-cyan-500/10 to-transparent blur-2xl" />
                  </div>

                  <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.accent} text-white shadow-lg shadow-cyan-500/10 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="relative mt-6 text-xl font-semibold text-white">{service.title}</h3>
                  <p className="relative mt-4 text-sm leading-7 text-slate-400">{service.description}</p>
                  <div className="relative mt-6">
                    <a href={service.href} className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-medium transition-colors">
                      Learn more
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
