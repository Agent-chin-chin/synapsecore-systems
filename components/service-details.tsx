export default function ServiceDetails() {
  return (
    <div className="min-h-screen py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
            Our Services
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            AI automation, cybersecurity, website development, bug fixing, and team training for enterprise-ready growth.
          </p>
        </div>

        <div className="space-y-16">
          {/* Website Development */}
          <section id="web-dev" className="bg-gray-800 rounded-lg p-8 border border-green-400/30 hover:border-green-400 transition-colors">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">🌐</div>
              <div>
                <h2 className="text-3xl font-bold text-green-400 mb-2">Website Development</h2>
                <p className="text-gray-300">Build stunning, high-performance websites that drive results.</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              From concept to launch, we design and develop responsive websites that engage your audience and convert visitors into customers. Using modern frameworks like React and Next.js, we create fast, scalable, and SEO-optimized digital experiences.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">What We Offer</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Custom site design & development
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Responsive mobile-first approach
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> E-commerce integration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> CMS & content management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Performance optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> SEO & analytics setup
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">Technologies</h3>
                <div className="space-y-2 text-gray-300">
                  <p className="text-sm"><strong>Frontend:</strong> React, Next.js, TypeScript, Tailwind CSS</p>
                  <p className="text-sm"><strong>Backend:</strong> Node.js, Express, PostgreSQL, MongoDB</p>
                  <p className="text-sm"><strong>Tools:</strong> Git, Docker, CI/CD pipelines, AWS/Vercel</p>
                  <p className="text-sm"><strong>Performance:</strong> Lighthouse scores 90+, Core Web Vitals optimized</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-400/10 border border-green-400/20 rounded">
              <p className="text-green-300 font-semibold">💡 Average project: 2-8 weeks | 50+ websites successfully launched</p>
            </div>
            <div className="mt-6">
              <a href="/services/web-dev" className="inline-flex items-center rounded-full bg-green-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-green-300 transition">
                Explore Web Development details
              </a>
            </div>
          </section>

          {/* AI Automation */}
          <section id="ai-automation" className="bg-gray-800 rounded-lg p-8 border border-green-400/30 hover:border-green-400 transition-colors">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">🤖</div>
              <div>
                <h2 className="text-3xl font-bold text-green-400 mb-2">AI Automation</h2>
                <p className="text-gray-300">Automate workflows with AI-driven orchestration and intelligent process management.</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Move beyond manual workflow handoffs. We implement automation platforms with smart decisioning, process monitoring, and business-level governance so teams can scale reliably.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">Capabilities</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Workflow automation and orchestration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Data-driven decision automation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Process monitoring and alerting
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Governance and compliance integration
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">Outcomes</h3>
                <div className="space-y-2 text-gray-300">
                  <p className="text-sm">Reduce manual task overhead with automated workflows.</p>
                  <p className="text-sm">Increase consistency across enterprise operations.</p>
                  <p className="text-sm">Improve speed for customer-facing and internal processes.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-400/10 border border-green-400/20 rounded">
              <p className="text-green-300 font-semibold">✨ Trusted automation for enterprise teams looking to scale safely.</p>
            </div>
            <div className="mt-6">
              <a href="/services/ai-automation" className="inline-flex items-center rounded-full bg-green-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-green-300 transition">
                Explore AI Automation details
              </a>
            </div>
          </section>

          {/* Cybersecurity */}
          <section id="cybersecurity" className="bg-gray-800 rounded-lg p-8 border border-green-400/30 hover:border-green-400 transition-colors">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">🛡️</div>
              <div>
                <h2 className="text-3xl font-bold text-green-400 mb-2">Cybersecurity</h2>
                <p className="text-gray-300">Protect your applications, infrastructure, and data with a comprehensive security strategy.</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              We combine proactive risk assessment, secure architecture, and continuous monitoring to help you reduce attack surface and improve resilience across the digital stack.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">Security services</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Threat detection and monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Vulnerability assessments
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Security architecture review
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Incident response readiness
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">Business value</h3>
                <div className="space-y-2 text-gray-300">
                  <p className="text-sm">Strengthen trust with secure digital products.</p>
                  <p className="text-sm">Avoid costly breaches and compliance gaps.</p>
                  <p className="text-sm">Build operational continuity into your delivery pipeline.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-400/10 border border-green-400/20 rounded">
              <p className="text-green-300 font-semibold">🛡️ Enterprise cybersecurity designed for modern software teams.</p>
            </div>
            <div className="mt-6">
              <a href="/services/cybersecurity" className="inline-flex items-center rounded-full bg-green-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-green-300 transition">
                Explore Cybersecurity details
              </a>
            </div>
          </section>

          {/* Bug Fixing */}
          <section id="bug-fixing" className="bg-gray-800 rounded-lg p-8 border border-green-400/30 hover:border-green-400 transition-colors">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">🔧</div>
              <div>
                <h2 className="text-3xl font-bold text-green-400 mb-2">Bug Fixing & Optimization</h2>
                <p className="text-gray-300">Diagnose, fix, and optimize your application issues fast.</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your application is broken, slow, or behaving unexpectedly. We diagnose issues quickly, fix bugs thoroughly, optimize performance, and deliver solutions you can rely on. Fast turnaround, lasting results.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">Our Process</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">1.</span> <strong>Rapid diagnosis</strong> (within 24 hours)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">2.</span> <strong>Root cause analysis</strong> & fix planning
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">3.</span> <strong>Implementation</strong> with code review
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">4.</span> <strong>Thorough testing</strong> & QA
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">5.</span> <strong>Deployment</strong> & monitoring
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">We Fix</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Frontend bugs (React, Vue, Angular)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Backend issues (APIs, databases, servers)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Performance problems
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Memory leaks & crashes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Compatibility issues
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-400/10 border border-green-400/20 rounded">
              <p className="text-green-300 font-semibold">⚡ 48-hour turnaround on most bugs | 98% first-fix success rate</p>
            </div>
            <div className="mt-6">
              <a href="/services/bug-fixing" className="inline-flex items-center rounded-full bg-green-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-green-300 transition">
                Explore Bug Fixing details
              </a>
            </div>
          </section>

          {/* Team Training */}
          <section id="training" className="bg-gray-800 rounded-lg p-8 border border-green-400/30 hover:border-green-400 transition-colors">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">📚</div>
              <div>
                <h2 className="text-3xl font-bold text-green-400 mb-2">Team Training & Certification</h2>
                <p className="text-gray-300">Upskill your developers with hands-on, practical training.</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empower your team to build modern applications with confidence. Our certification-ready training programs cover web development, frameworks, best practices, and deployment strategies. Learn by doing with real-world projects.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">Training Programs</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> <strong>Web Dev Fundamentals</strong> (4 weeks)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> <strong>React Advanced</strong> (3 weeks)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> <strong>Full-Stack Development</strong> (6 weeks)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> <strong>DevOps & Deployment</strong> (2 weeks)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Custom curriculum for your needs
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">Delivery Format</h3>
                <ul className="space-y-3 text-gray-300">
                  <li><strong>Live online sessions</strong> with interactive Q&A</li>
                  <li><strong>Hands-on labs</strong> with real code challenges</li>
                  <li><strong>Code reviews</strong> from senior engineers</li>
                  <li><strong>Project-based learning</strong> (build a portfolio)</li>
                  <li><strong>Certification exam</strong> upon completion</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-400/10 border border-green-400/20 rounded">
              <p className="text-green-300 font-semibold">🎓 200+ developers trained | 95% pass rate | Lifetime access to course materials</p>
            </div>
            <div className="mt-6">
              <a href="/services/team-training" className="inline-flex items-center rounded-full bg-green-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-green-300 transition">
                Explore Training details
              </a>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-6">Ready to get started?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="px-8 py-3 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors">
              Schedule Consultation
            </a>
            <a href="/pricing" className="px-8 py-3 border border-green-400 text-green-400 font-bold rounded-lg hover:bg-green-400/10 transition-colors">
              View Pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
