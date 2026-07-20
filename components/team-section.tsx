export default function TeamSection() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-12">
          Meet Our Team
        </h2>
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-12">
          Expert developers, architects, and trainers dedicated to delivering excellence.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-900 rounded-lg border border-green-400/30 p-6 text-center hover:border-green-400 transition-colors">
            <div className="flex items-center justify-center h-16 w-16 mb-4 bg-green-400/10 mx-auto rounded-full">
              <span className="text-3xl">👨‍💻</span>
            </div>
            <h3 className="text-lg font-bold text-green-400 mb-1">Alex Rivera</h3>
            <p className="text-gray-400 text-sm mb-3">Lead Developer & Architect</p>
            <p className="text-gray-300 text-xs">15+ years building scalable web applications. React expert.</p>
          </div>
          <div className="bg-gray-900 rounded-lg border border-green-400/30 p-6 text-center hover:border-green-400 transition-colors">
            <div className="flex items-center justify-center h-16 w-16 mb-4 bg-green-400/10 mx-auto rounded-full">
              <span className="text-3xl">👩‍💻</span>
            </div>
            <h3 className="text-lg font-bold text-green-400 mb-1">Samira Patel</h3>
            <p className="text-gray-400 text-sm mb-3">Full-Stack Developer</p>
            <p className="text-gray-300 text-xs">Node.js & PostgreSQL specialist. Performance optimization focus.</p>
          </div>
          <div className="bg-gray-900 rounded-lg border border-green-400/30 p-6 text-center hover:border-green-400 transition-colors">
            <div className="flex items-center justify-center h-16 w-16 mb-4 bg-green-400/10 mx-auto rounded-full">
              <span className="text-3xl">👨‍🏫</span>
            </div>
            <h3 className="text-lg font-bold text-green-400 mb-1">Marcus Chen</h3>
            <p className="text-gray-400 text-sm mb-3">Training Director</p>
            <p className="text-gray-300 text-xs">Trained 200+ developers. Curriculum design expert.</p>
          </div>
          <div className="bg-gray-900 rounded-lg border border-green-400/30 p-6 text-center hover:border-green-400 transition-colors">
            <div className="flex items-center justify-center h-16 w-16 mb-4 bg-green-400/10 mx-auto rounded-full">
              <span className="text-3xl">👩‍💼</span>
            </div>
            <h3 className="text-lg font-bold text-green-400 mb-1">Jordan Lee</h3>
            <p className="text-gray-400 text-sm mb-3">Operations & Client Success</p>
            <p className="text-gray-300 text-xs">Ensures every project delivers results on time, every time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}