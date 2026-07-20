'use client';

import { useState } from 'react';
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

const whitepapers = [
  { id: 1, title: 'API Architecture for Modern Applications', description: 'Comprehensive guide to designing scalable and maintainable APIs.', pages: 28, publishDate: 'March 2024', author: 'Technical Team', category: 'Architecture', icon: '📐' },
  { id: 2, title: 'Security Best Practices in API Design', description: 'Essential security principles and implementation strategies.', pages: 35, publishDate: 'February 2024', author: 'Security Team', category: 'Security', icon: '🔒' },
  { id: 3, title: 'Scaling Your Infrastructure', description: 'Detailed strategies for scaling APIs to handle millions of requests.', pages: 42, publishDate: 'January 2024', author: 'Operations Team', category: 'Infrastructure', icon: '📈' },
  { id: 4, title: 'Real-time Data Synchronization', description: 'Implementation guide for achieving real-time data consistency.', pages: 31, publishDate: 'December 2023', author: 'Engineering Team', category: 'Webhooks', icon: '🔄' },
  { id: 5, title: 'Cost Optimization Strategies', description: 'Reduce your API infrastructure costs without compromising performance.', pages: 25, publishDate: 'November 2023', author: 'Finance Team', category: 'Operations', icon: '💰' },
  { id: 6, title: 'Monitoring and Observability', description: 'Build comprehensive monitoring systems for production APIs.', pages: 38, publishDate: 'October 2023', author: 'DevOps Team', category: 'Monitoring', icon: '🔍' },
];

const categories = ['All', 'Architecture', 'Security', 'Infrastructure', 'Webhooks', 'Operations', 'Monitoring'];

export default function WhitepapersPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const filtered = selectedCategory === 'All' ? whitepapers : whitepapers.filter((w) => w.category === selectedCategory);

  const handleDownload = (title: string) => {
    alert(`Downloading: ${title}\n\nIn production, this would trigger a real PDF download.`);
  };

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribing(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribed(true);
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      // ignore
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <ScrollReveal>
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">Whitepapers</h1>
            <p className="text-xl text-gray-400">In-depth technical documentation and research papers</p>
          </motion.div>

          <ScrollReveal delay={0.2}>
            <motion.div
              className="mb-12 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded font-bold transition-colors ${category === selectedCategory ? 'bg-green-400 text-black' : 'border border-green-400/30 text-white hover:border-green-400'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((paper, i) => (
              <ScrollReveal key={paper.id} delay={i * 0.1}>
                <motion.div
                  className="bg-gray-800 rounded-lg border border-green-400/30 p-6 hover:border-green-400/60 transition-colors hover:shadow-lg hover:shadow-green-400/10 cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{paper.icon}</div>
                    <span className="px-3 py-1 bg-green-400/10 border border-green-400/30 text-green-400 text-xs font-bold rounded-full">{paper.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{paper.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{paper.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4 pb-4 border-b border-gray-700">
                    <span>{paper.pages} pages</span>
                    <span>{paper.publishDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">{paper.author}</span>
                    <button onClick={() => handleDownload(paper.title)} className="bg-green-400 hover:bg-green-300 text-black font-bold py-2 px-4 rounded text-sm transition-colors">Download PDF</button>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.6}>
            <motion.div
              className="mt-12 bg-gray-800 rounded-lg border border-green-400/30 p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-green-400 mb-4">Subscribe to New Whitepapers</h2>
                <p className="text-gray-400 mb-6">Get notified when we publish new research and technical documentation.</p>
                {subscribed ? (
                  <p className="text-green-400">You&apos;re subscribed.</p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-3">
                    <input type="email" name="email" placeholder="your@email.com" className="flex-1 bg-gray-700 border border-green-400/30 text-white rounded px-4 py-3 focus:outline-none focus:border-green-400" required />
                    <motion.button
                      type="submit"
                      disabled={subscribing}
                      className="bg-green-400 hover:bg-green-300 text-black font-bold py-3 px-6 rounded transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {subscribing ? 'Subscribing...' : 'Subscribe'}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </ScrollReveal>
  );
}
