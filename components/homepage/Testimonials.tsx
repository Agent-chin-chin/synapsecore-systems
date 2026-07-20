import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "SynapseCore reduced our incident response time from 4 hours to 18 minutes and prevented 47 security breaches in 6 months.",
    author: "Maya Patel",
    role: "CIO, Blue Harbor Financial",
    metric: "73% faster response",
    initials: "MP",
  },
  {
    quote: "The training program improved our team's certification pass rate to 94% with measurable ROI from day one.",
    author: "Daniel Kim",
    role: "VP, Infrastructure & Security",
    metric: "94% pass rate",
    initials: "DK",
  },
  {
    quote: "Our automated workflows now handle 150+ security alerts daily, saving 200+ hours monthly in manual review.",
    author: "Alicia Grant",
    role: "Head of Engineering, Atlas Dynamics",
    metric: "200+ hrs saved",
    initials: "AG",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Trusted by leaders
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Proven outcomes from enterprise teams.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="group relative rounded-[2rem] border border-green-400/30 bg-gray-900 p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:shadow-[0_20px_50px_rgba(34,197,94,0.15)]"
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-green-400 text-green-400" />
                ))}
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-black font-bold text-sm">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              <Quote className="h-8 w-8 text-green-400/30 mb-4" />
              <p className="text-base leading-8 text-gray-300">"{testimonial.quote}"</p>

              <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full">
                  {testimonial.metric}
                </span>
                <div className="h-1.5 w-16 rounded-full bg-green-400/20">
                  <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-green-400 to-cyan-400"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
