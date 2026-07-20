'use client';

import React, { useState } from 'react';
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BlogPageClient() {
  const posts = [
    { id: 1, title: 'Introducing API v2: Faster, More Secure', excerpt: 'We\'re excited to announce our new API version with improved performance and enhanced security features.', category: 'Product Updates', author: 'Sarah Chen', date: 'March 15, 2024', readTime: '5 min read', image: '📦' },
    { id: 2, title: 'Best Practices for API Security', excerpt: 'Learn essential security practices to protect your integrations and keep your data safe.', category: 'Security', author: 'David Martinez', date: 'March 10, 2024', readTime: '8 min read', image: '🔒' },
    { id: 3, title: 'Scaling Your Application: A Developer\'s Guide', excerpt: 'Practical tips and strategies for scaling your application as your user base grows.', category: 'Engineering', author: 'Emma Wilson', date: 'March 5, 2024', readTime: '10 min read', image: '📈' },
    { id: 4, title: 'Webhook Mastery: Real-time Data Integration', excerpt: 'Deep dive into webhooks and how to implement real-time data synchronization.', category: 'Webhooks', author: 'Alex Rodriguez', date: 'February 28, 2024', readTime: '7 min read', image: '🔗' },
    { id: 5, title: 'Rate Limiting 101: Protect Your API', excerpt: 'Understanding rate limiting and how to implement it effectively in your system.', category: 'API Design', author: 'Lisa Park', date: 'February 20, 2024', readTime: '6 min read', image: '⚡' },
    { id: 6, title: 'Authentication Patterns and Anti-Patterns', excerpt: 'Common authentication approaches and what to avoid when building secure APIs.', category: 'Security', author: 'James Thompson', date: 'February 15, 2024', readTime: '9 min read', image: '🔑' },
  ];

  const categories = ['All', 'Product Updates', 'Security', 'Engineering', 'Webhooks', 'API Design'];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = selectedCategory === 'All' ? posts : posts.filter((p) => p.category === selectedCategory);

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
            <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
            <p className="text-xl text-gray-400">Latest insights, tips, and updates from our team</p>
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

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {filtered.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 0.1}>
                <motion.article
                  className="bg-gray-800 rounded-lg border border-green-400/30 overflow-hidden hover:border-green-400/60 transition-colors cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <motion.div
                    className="h-40 bg-gray-700 flex items-center justify-center text-5xl group-hover:bg-gray-600 transition-colors"
                  >
                    {post.image}
                  </motion.div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-block px-3 py-1 bg-green-400/10 border border-green-400/30 text-green-400 text-xs font-bold rounded-full">{post.category}</span>
                      <span className="text-gray-400 text-xs">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{post.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.6}>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                className="bg-green-400 hover:bg-green-300 text-black font-bold py-3 px-8 rounded transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Load More Posts
              </motion.button>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </ScrollReveal>
  );
}
