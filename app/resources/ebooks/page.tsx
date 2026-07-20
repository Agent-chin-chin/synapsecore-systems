'use client'
'use client';

import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function EbooksPage() {
  const ebooks = [
    { title: 'Cybersecurity 101', author: 'Security Team', pages: 120 },
    { title: 'API Security', author: 'Dev Team', pages: 95 }
  ];

  const handleDownload = (title: string) => {
    alert(`Downloading: ${title}\n\nIn production, this would trigger a real PDF download.`);
  };

  return (
    <ScrollReveal>
      <div className="min-h-[calc(100vh-64px)] py-20 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-green-400 mb-4">E-Books</h1>
            <p className="text-gray-300 mb-12">Download our comprehensive guides.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {ebooks.map((book, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div
                  className="bg-gray-800 border border-green-400/30 rounded-lg p-6 hover:border-green-400/60 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <div className="text-6xl mb-4">📖</div>
                  <h3 className="text-lg font-bold text-green-400 mb-2">{book.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">By {book.author} • {book.pages} pages</p>
                  <button
                    onClick={() => handleDownload(book.title)}
                    className="w-full px-4 py-2 bg-green-400 text-black font-bold rounded-lg hover:bg-green-300 transition-colors"
                  >
                    Download
                  </button>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
