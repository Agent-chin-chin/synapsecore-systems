export default function ContactInfo() {
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-green-400 mb-8 text-center">
        Get in Touch
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gray-800 rounded-lg border border-green-400/30 p-8 text-center hover:border-green-400 transition-colors">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl">📧</span>
          </div>
          <h3 className="text-lg font-semibold text-green-400 mb-2">
            Email Support
          </h3>
          <p className="text-gray-300">
            support@synapsecoresystems.com
          </p>
          <p className="text-gray-400 text-sm mt-2">Response within 24 hours</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-green-400/30 p-8 text-center hover:border-green-400 transition-colors">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-green-400 mb-2">
            WhatsApp Support
          </h3>
          <p className="text-gray-300">
            +234 913 457 0621
          </p>
          <p className="text-gray-400 text-sm mt-2">Available 9AM-6PM WAT</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-green-400/30 p-8 text-center hover:border-green-400 transition-colors">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl">📞</span>
          </div>
          <h3 className="text-lg font-semibold text-green-400 mb-2">
            Phone Support
          </h3>
          <p className="text-gray-300">
            +234 913 457 0621
          </p>
          <p className="text-gray-400 text-sm mt-2">Monday-Friday, 9AM-6PM</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-orange-400/30 p-8 text-center hover:border-orange-400 transition-colors">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl">🚨</span>
          </div>
          <h3 className="text-lg font-semibold text-orange-400 mb-2">
            24/7 Emergency Line
          </h3>
          <p className="text-gray-300">
            +234 913 457 0621
          </p>
          <p className="text-gray-400 text-sm mt-2">For critical incidents only</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-green-400/30 p-8 text-center hover:border-green-400 transition-colors">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl">📍</span>
          </div>
          <h3 className="text-lg font-semibold text-green-400 mb-2">
            Office Location
          </h3>
          <p className="text-gray-300">
            Lagos, Nigeria
          </p>
          <p className="text-gray-400 text-sm mt-2">By appointment</p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-green-400/30 p-8 text-center hover:border-green-400 transition-colors">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl">💻</span>
          </div>
          <h3 className="text-lg font-semibold text-green-400 mb-2">
            Live Chat
          </h3>
          <p className="text-gray-300">
            Chat with our team
          </p>
          <p className="text-gray-400 text-sm mt-2">Available 9AM-6PM WAT</p>
        </div>
      </div>
    </div>
  );
}