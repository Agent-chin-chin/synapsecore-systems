const solutions = [
  {
    title: "Workflow automation that scales with your business",
    description: "Deploy intelligent routing, approval automation, and cross-team orchestration with enterprise-grade visibility and controls.",
    bullets: [
      "Automate repetitive tasks across systems.",
      "Reduce manual backlog and human error.",
      "Maintain audit trails and governance oversight.",
    ],
  },
  {
    title: "Operational efficiency through integrated platforms",
    description: "Bridge security, cloud, and engineering workflows with data-driven service delivery and real-time performance insights.",
    bullets: [
      "Consolidated dashboards for technical leaders.",
      "Fast feedback loops for incident and deployment teams.",
      "Unified tooling for secure, compliant operations.",
    ],
  },
  {
    title: "Cyber defense tailored for critical infrastructure",
    description: "Protect modern attack surfaces with adaptive detection, rapid response playbooks, and managed threat intelligence.",
    bullets: [
      "Continuous monitoring across cloud and on-premise.",
      "Risk-aware controls for regulated systems.",
      "Incident readiness aligned to your security posture.",
    ],
  },
  {
    title: "Scalable infrastructure for resilient growth",
    description: "Build stable, secure platforms ready for enterprise adoption, product launches, and technology modernization.",
    bullets: [
      "Cloud-native architecture and secure deployment patterns.",
      "Modular integrations for legacy and modern systems.",
      "Performance tuned for global teams and users.",
    ],
  },
];

export default function SolutionsOverview() {
  return (
    <section id="solutions" className="border-t border-white/10 bg-slate-950/80 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Business Outcomes
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Solutions built to deliver measurable enterprise results.
          </h2>
        </div>

        <div className="mt-12 space-y-12">
          {solutions.map((solution, index) => (
            <div
              key={solution.title}
              className={`grid gap-8 lg:grid-cols-[0.55fr_0.45fr] ${index % 2 === 1 ? "lg:grid-flow-dense lg:grid-cols-[0.45fr_0.55fr]" : ""}`}
            >
              <div className="rounded-[2rem] border border-white/10 bg-[#070b14] p-10 shadow-[0_30px_60px_rgba(8,15,35,0.22)]">
                <p className="text-2xl font-semibold text-white">{solution.title}</p>
                <p className="mt-4 text-base leading-7 text-slate-400">{solution.description}</p>
              </div>
              <div className="flex flex-col justify-center gap-4">
                {solution.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-slate-300 shadow-glow">
                    <p className="text-sm leading-7">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
