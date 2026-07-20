import Link from "next/link";

export default function LearnerEnrollmentPromo() {
  return (
    <section className="border-t border-white/10 bg-[#070B14] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.6fr_0.4fr] items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-400">
              Learning Academy
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Start your cybersecurity career with hands-on training.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
              Enroll in structured courses, earn certifications, and learn from industry experts. No prior experience required.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { title: "Self-paced courses", detail: "Learn on your schedule with structured modules and real-world labs." },
                { title: "Certificates", detail: "Earn verifiable credentials for completed tracks and assessments." },
                { title: "Expert mentorship", detail: "Get guidance from practitioners with active field experience." },
                { title: "Career paths", detail: "Follow curated tracks from analyst to engineer to leadership roles." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/learner/register" className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Enroll Now
              </Link>
              <Link href="/services/team-training" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-7 py-3 text-sm font-medium text-white transition hover:border-emerald-300">
                Browse Training Programs
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] p-8" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
            <div className="space-y-5">
              <div className="rounded-3xl p-6" style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="mb-2 text-sm" style={{ color: "#94A3B8" }}>Active learners</p>
                <h3 className="text-4xl font-bold text-white">12,400+</h3>
              </div>
              <div className="rounded-3xl p-6" style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="mb-2 text-sm" style={{ color: "#94A3B8" }}>Courses available</p>
                <h3 className="text-4xl font-bold text-white">85+</h3>
              </div>
              <div className="rounded-3xl p-6" style={{ background: "rgba(2,6,23,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="mb-2 text-sm" style={{ color: "#94A3B8" }}>Completion rate</p>
                <h3 className="text-4xl font-bold text-white">94%</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
