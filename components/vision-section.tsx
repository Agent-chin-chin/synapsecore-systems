export default function VisionSection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-8">
            Our Vision for 2026 & Beyond
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-4">Short-term (Next 12 months)</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">→</span>
                  <span>Build 100+ websites for businesses of all sizes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">→</span>
                  <span>Train 300+ developers through certification programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">→</span>
                  <span>Fix critical bugs for 50+ enterprise applications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">→</span>
                  <span>Expand to 3 regional offices</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-4">Long-term (2027+)</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">→</span>
                  <span>Become the preferred partner for businesses transforming digitally</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">→</span>
                  <span>Launch academy with industry certifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">→</span>
                  <span>Build AI-powered development tools for the community</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 font-bold mt-1">→</span>
                  <span>Create scholarship program for underprivileged developers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}