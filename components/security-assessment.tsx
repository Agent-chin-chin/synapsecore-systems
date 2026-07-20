"use client";

import { useState } from 'react';

const assessmentQuestions = [
  {
    id: 1,
    question: "What best describes your current environment?",
    options: [
      "Public-facing website or e-commerce platform",
      "Internal network or enterprise system",
      "Cloud infrastructure / APIs",
      "I’m not sure"
    ]
  },
  {
    id: 2,
    question: "How many security incidents have you had in the past 12 months?",
    options: ["None", "1-2", "3-5", "More than 5"]
  },
  {
    id: 3,
    question: "What is your biggest concern?",
    options: ["Data breach", "Service downtime", "Ransomware", "Reputation damage"]
  },
  {
    id: 4,
    question: "Do you have a current security monitoring solution?",
    options: ["Yes, 24/7 monitoring", "Limited monitoring", "No monitoring", "Not sure"]
  }
];

export default function SecurityAssessment() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (id: number, option: string) => {
    setAnswers(prev => ({ ...prev, [id]: option }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === assessmentQuestions.length) {
      setSubmitted(true);
    }
  };

  const score = Object.values(answers).reduce((total, answer) => {
    if (answer.includes('None') || answer.includes('24/7')) return total + 1;
    if (answer.includes('Limited') || answer.includes('1-2')) return total + 2;
    if (answer.includes('More') || answer.includes('Ransomware') || answer.includes('Public-facing') || answer.includes('Cloud')) return total + 3;
    return total + 2;
  }, 0);

  const recommendation = () => {
    if (score <= 5) {
      return {
        title: 'Ready to Harden',
        description: 'Your environment is stable, but we recommend proactive penetration testing and continuous monitoring to stay ahead of threats.'
      };
    }
    if (score <= 9) {
      return {
        title: 'Critical Risk Detected',
        description: 'You need an emergency security audit and incident response plan. Our team can secure your systems before a breach escalates.'
      };
    }
    return {
      title: 'Immediate Response Required',
      description: 'High-risk exposure detected. We recommend immediate containment, vulnerability elimination, and advanced threat monitoring.'
    };
  };

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-white cyber-glitch">
            SECURITY HEALTH ASSESSMENT
          </h2>
          <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
            Complete this quick assessment to see where your cybersecurity posture stands and get an instant recommendation.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {assessmentQuestions.map(question => (
              <div key={question.id} className="bg-gray-900 border border-green-500 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">{question.question}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {question.options.map(option => (
                    <button
                      key={option}
                      onClick={() => handleSelect(question.id, option)}
                      className={`rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${answers[question.id] === option ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200 shadow-glow' : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-cyan-400 hover:bg-slate-800'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-200"
              >
                Get Instant Recommendation
              </button>
              <p className="text-sm text-slate-400">Answer all 4 questions for the most accurate result.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-500 bg-gray-900 p-8 shadow-2xl">
            <div className="mb-6">
              <span className="inline-flex rounded-full bg-cyan-500/15 px-4 py-1 text-cyan-200 text-sm font-semibold">Rapid Security Pulse</span>
            </div>
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-700 bg-slate-950 p-5">
                <div className="text-sm text-slate-400 uppercase tracking-[0.2em]">Current Assessment Status</div>
                <div className="mt-4 text-5xl font-bold text-white">{Object.keys(answers).length}/4</div>
                <div className="mt-2 text-slate-300">Questions answered</div>
              </div>

              <div className="rounded-3xl border border-slate-700 bg-slate-950 p-5">
                <div className="text-sm text-slate-400 uppercase tracking-[0.2em]">Security Score</div>
                <div className="mt-4 text-5xl font-bold text-cyan-400">{score}</div>
                <div className="mt-2 text-slate-300">Lower is safer; higher means faster action needed.</div>
              </div>

              {submitted && (
                <div className="rounded-3xl border border-green-500 bg-slate-900 p-6">
                  <div className="text-sm text-green-300 uppercase tracking-[0.2em]">Recommendation</div>
                  <h3 className="mt-4 text-2xl font-bold text-white">{recommendation().title}</h3>
                  <p className="mt-3 text-slate-300">{recommendation().description}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a href="tel:+1555911CYBER" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-2xl text-center transition-all duration-200">
                      📞 Emergency Response
                    </a>
                    <a href="/contact" className="flex-1 border border-cyan-500 text-cyan-200 hover:bg-cyan-500/10 py-3 px-5 rounded-2xl text-center transition-all duration-200">
                      🚀 Book a Security Audit
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
