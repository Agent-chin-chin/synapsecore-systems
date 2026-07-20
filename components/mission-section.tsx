export default function MissionSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6">
            Our Mission
          </h2>
          <div className="border-l-4 border-green-400 pl-6 text-left max-w-3xl mx-auto">
            <p className="text-xl text-gray-300 leading-relaxed">
              At SynapseCore Systems, our mission is to empower businesses and developers by providing world-class website development, rapid bug fixes, and transformative training programs. We believe in building lasting partnerships, delivering excellence, and helping teams achieve their full potential through modern technology and expert guidance.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gray-800 p-8 rounded-lg border border-green-400/30 hover:border-green-400 transition-colors">
            <div className="text-3xl mb-4">🌐</div>
            <h3 className="text-xl font-bold text-green-400 mb-3">Build with Purpose</h3>
            <p className="text-gray-300">Every website we build is designed to drive real business results. We focus on performance, user experience, and conversion optimization.</p>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg border border-green-400/30 hover:border-green-400 transition-colors">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-green-400 mb-3">Fix with Precision</h3>
            <p className="text-gray-300">Critical bugs demand rapid, expert solutions. We diagnose and fix issues thoroughly, getting your apps back online fast.</p>
          </div>
          <div className="bg-gray-800 p-8 rounded-lg border border-green-400/30 hover:border-green-400 transition-colors">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-green-400 mb-3">Teach for Growth</h3>
            <p className="text-gray-300">We believe in knowledge sharing. Our training programs equip developers with skills to solve their own challenges and grow careers.</p>
          </div>
        </div>
      </div>
    </section>
  );
}