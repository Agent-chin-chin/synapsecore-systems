'use client';

import { useState } from 'react';

export default function PricingPlans() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  
  const plans = [
    {
      name: 'Basic',
      desc: 'For small projects',
      price: billing === 'monthly' ? '₦49,500' : '₦445,500',
      features: ['Malware scanning', 'Email support', 'Basic threat monitoring', 'Monthly security report']
    },
    {
      name: 'Standard',
      desc: 'Most popular choice',
      price: billing === 'monthly' ? '₦132,200' : '₦1,190,000',
      features: ['Malware removal (1 incident/month)', 'Priority email support', 'Weekly security reports', 'WordPress security included', 'Vulnerability assessment'],
      popular: true
    },
    {
      name: 'Premium',
      desc: 'For growing businesses',
      price: billing === 'monthly' ? '₦248,900' : '₦2,240,000',
      features: ['Unlimited malware removal', '24/7 phone & email support', 'Real-time security monitoring', 'Emergency response included', 'Payment gateway security', 'Compliance reporting']
    },
    {
      name: 'Emergency Rescue',
      desc: 'Critical incidents only',
      price: billing === 'monthly' ? '₦497,700' : '₦4,480,000',
      features: ['24/7 emergency response', 'Unlimited emergency incidents', 'Priority malware removal', 'Immediate server security', 'Database emergency repair', 'Dedicated emergency engineer', '15-minute response SLA']
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
            Pricing Plans
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            Flexible pricing for every business size. All plans include professional support and regular updates.
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-800 rounded-full p-2">
            <button onClick={() => setBilling('monthly')} className={`px-4 py-2 rounded-full text-sm font-medium transition ${billing === 'monthly' ? 'bg-green-400 text-black' : 'text-gray-400'}`}>
              Monthly
            </button>
            <button onClick={() => setBilling('annual')} className={`px-4 py-2 rounded-full text-sm font-medium transition ${billing === 'annual' ? 'bg-green-400 text-black' : 'text-gray-400'}`}>
              Annual (Save 10%)
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4 mb-12">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-gray-800 rounded-lg p-8 border flex flex-col h-full ${plan.popular ? 'border-green-400' : 'border-green-400/30'}`}>
              {plan.popular && (
                <span className="bg-green-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block w-fit">
                  Popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-green-400 mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
              <p className="text-4xl font-bold text-green-400 mb-2">{plan.price}</p>
              <p className="text-gray-400 text-sm mb-6">/{billing === 'monthly' ? 'month' : 'year'}</p>
              <ul className="space-y-3 mb-8 flex-grow text-gray-300">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="/contact" className={`w-full text-center font-bold py-3 px-4 rounded-md transition ${plan.name === 'Emergency Rescue' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-green-400 hover:bg-green-300 text-black'}`}>
                {plan.name === 'Emergency Rescue' ? 'Get Emergency Help' : 'Get Started'}
              </a>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg p-8 border border-green-400/30 mb-12">
          <h3 className="text-2xl font-bold text-green-400 mb-4">All plans include:</h3>
          <div className="grid md:grid-cols-4 gap-4 text-gray-300">
            <div>✓ 24/7 monitoring</div>
            <div>✓ Security audit</div>
            <div>✓ Expert consultation</div>
            <div>✓ Compliance support</div>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-300 font-semibold mb-2">⚠ Limited Capacity: Only 3 Premium spots available this month</p>
          <p className="text-gray-400 text-sm">Next onboarding: June 20, 2026</p>
        </div>
      </div>
    </section>
  );
}