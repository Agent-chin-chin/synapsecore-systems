import Link from "next/link";

export default function WebDevPromo() {
  return (
    <section className="border-t border-white/10 bg-[#070B14] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.6fr_0.4fr] items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-indigo-300">
              Website Development
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Enterprise web applications built for security, scale, and performance.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
              From secure front-ends to resilient APIs and CI/CD pipelines, we deliver maintainable platforms that meet enterprise SLAs and compliance requirements.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { title: "Secure architecture", detail: "Modular design with security controls at every layer." },
                { title: "Performance-first", detail: "Optimized for speed, SEO, and accessibility." },
                { title: "CI/CD & observability", detail: "Automated testing, deployments, and monitoring." },
                { title: "Long-term support", detail: "Ongoing maintenance, patches, and feature evolution." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-indigo-400/40 hover:bg-slate-900/90">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-400/10 text-indigo-300 flex items-center justify-center text-sm">◆</div>
                    <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-indigo-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-300">
                Request Project Review
              </Link>
              <Link href="/services/web-dev" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-7 py-3 text-sm font-medium text-white transition hover:border-indigo-300">
                View Web Dev Services
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] p-8" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
            <div className="space-y-5">
              <div className="rounded-3xl p-6" style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="mb-2 text-sm" style={{ color: "#94A3B8" }}>Projects delivered</p>
                <h3 className="text-4xl font-bold text-white">240+</h3>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-indigo-400 to-violet-500"></div>
                </div>
              </div>
              <div className="rounded-3xl p-6" style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="mb-2 text-sm" style={{ color: "#94A3B8" }}>Avg. page load</p>
                <h3 className="text-4xl font-bold text-white">&lt;1.2s</h3>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-indigo-400 to-violet-500"></div>
                </div>
              </div>
              <div className="rounded-3xl p-6" style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="mb-2 text-sm" style={{ color: "#94A3B8" }}>Security score</p>
                <h3 className="text-4xl font-bold text-white">A+</h3>
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-indigo-400 to-violet-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
