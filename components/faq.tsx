"use client";

import { useState } from 'react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "What's included in your website development service?",
      answer: "Our website development service includes: custom design aligned with your brand, fully responsive layout (mobile-first), performance optimization (Lighthouse 90+), SEO setup, analytics integration, hosting setup, and 30 days of free post-launch support. We use modern technologies like React, Next.js, and Tailwind CSS."
    },
    {
      question: "How quickly can you fix critical bugs?",
      answer: "We prioritize critical bugs and aim for a diagnosis within 24 hours. Most bugs are fixed within 48 hours. For emergency situations, we offer same-day response with our priority support tier. You can submit urgent bugs through our contact form, and we'll acknowledge receipt immediately."
    },
    {
      question: "Do you offer training for complete beginners?",
      answer: "Yes! Our Web Development Fundamentals program is designed for beginners with no prior coding experience. We start from the basics (HTML, CSS, JavaScript) and progress to building real applications. Each course includes hands-on labs, code reviews, and lifetime access to course materials."
    },
    {
      question: "What if the website doesn't meet my expectations?",
      answer: "We include 2 rounds of revisions in our standard package to refine the design and functionality. If major changes are needed beyond scope, we discuss options and provide a transparent quote. Our 30-day post-launch support ensures you're happy before we're done."
    },
    {
      question: "Can you fix bugs in legacy code?",
      answer: "Absolutely. We specialize in working with old codebases, legacy systems, and technologies you thought were outdated. We'll assess the codebase, create a plan, and fix issues systematically. We also help migrate legacy apps to modern frameworks if desired."
    },
    {
      question: "Do you provide ongoing maintenance and support?",
      answer: "Yes! We offer flexible maintenance packages: Basic (monthly updates, security patches), Standard (includes feature enhancements, 4 support tickets), and Premium (24/7 support, proactive monitoring, optimization). All packages include version updates and dependency management."
    },
    {
      question: "What technologies do you use?",
      answer: "Frontend: React, Next.js, Vue.js, TypeScript, Tailwind CSS. Backend: Node.js, Express, Python (Django/FastAPI), PHP. Databases: PostgreSQL, MongoDB, Firebase. DevOps: Docker, AWS, Vercel, GitHub Actions. We choose the best tech stack for each project's requirements."
    },
    {
      question: "Are your training programs hands-on?",
      answer: "100% hands-on. You'll build real projects, not just watch videos. Each training program includes live sessions with instructors, coding exercises, code reviews from senior engineers, and a capstone project that goes into your portfolio. Certified upon completion."
    },
    {
      question: "What's your refund policy?",
      answer: "For web development: 100% refund if not started. 50% refund if in early stages. For bug fixing: 100% refund if the issue isn't fixed. For training: 14-day money-back guarantee if you're not satisfied. See our Refund Policy page for details."
    },
    {
      question: "How do I get started?",
      answer: "Schedule a free 30-minute consultation via our contact page. We'll discuss your needs, timeline, and budget. After the call, we'll send a proposal with scope, timeline, and pricing. Once approved, we get started immediately. No hidden fees, full transparency."
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-center text-gray-300 mb-12">
          Find answers to common questions about our services and how we work.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800 border border-green-400/30 rounded-lg hover:border-green-400 transition-colors overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-green-400 pr-4">
                  {faq.question}
                </h3>
                <span className={`text-2xl text-green-400 transition-transform duration-300 flex-shrink-0 ${openItems.includes(index) ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${openItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-4 border-t border-green-400/20">
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-green-400/10 to-blue-500/10 border border-green-400/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-300 mb-6">
            Our team is ready to help. Schedule a consultation or reach out via chat, email, or WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="px-6 py-3 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors">
              Schedule Consultation
            </a>
            <a href="https://wa.me/+2349134570621" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-green-400 text-green-400 font-bold rounded-lg hover:bg-green-400/10 transition-colors">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

