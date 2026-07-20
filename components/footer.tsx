export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="SynapseCore Systems Logo" className="h-10 w-10 rounded-2xl bg-white/5 p-1" />
              <div>
                <p className="text-lg font-semibold text-white">SynapseCore</p>
                <p className="text-sm text-slate-400">Intelligent automation, resilient cybersecurity, and transformative training.</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Services</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li>
                <a href="/services/web-dev" className="transition hover:text-white">Web Development</a>
              </li>
              <li>
                <a href="/services/ai-automation" className="transition hover:text-white">AI Automation</a>
              </li>
              <li>
                <a href="/services/cybersecurity" className="transition hover:text-white">Cybersecurity</a>
              </li>
              <li>
                <a href="/services/team-training" className="transition hover:text-white">Training & Certification</a>
              </li>
              <li>
                <a href="/services/bug-fixing" className="transition hover:text-white">Bug Fixing & Support</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Company</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li>
                <a href="/about" className="transition hover:text-white">About Us</a>
              </li>
              <li>
                <a href="/contact" className="transition hover:text-white">Contact</a>
              </li>
              <li>
                <a href="/privacy-policy" className="transition hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms-of-service" className="transition hover:text-white">Terms of Service</a>
              </li>
              <li>
                <a href="/refund-policy" className="transition hover:text-white">Refund Policy</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Contact</h4>
            <div className="mt-5 space-y-4 text-sm text-slate-400">
              <p>support@synapsecoresystems.com</p>
              <p>+1 (555) 021-0098</p>
              <p>24/7 Managed Support</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-slate-400">
              <a href="#" className="transition hover:text-white">LinkedIn</a>
              <a href="#" className="transition hover:text-white">Twitter</a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} SynapseCore Systems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
