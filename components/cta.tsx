import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-green-400 mb-4">Ready to secure your business?</h2>
        <p className="text-gray-300 mb-8">
          Get a free security assessment and custom roadmap for your organization.
        </p>
        <Link href="/contact" className="inline-block bg-green-400 hover:bg-green-300 text-black font-bold py-3 px-6 rounded-md transition-colors">
          Get Started Today
        </Link>
      </div>
    </section>
  );
}