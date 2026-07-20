'use client'
'use client';

import ContactForm from "@/components/contact-form";
import BookingForm from "@/components/booking-form";
import ContactInfo from "@/components/contact-info";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="min-h-[calc(100vh-64px)] py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={0}>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
              Contact & Support
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We're here to help. Reach out to us through any of these channels and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <div className="grid gap-8 md:grid-cols-2 mb-16">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <ContactForm />
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <BookingForm />
            </motion.div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <ContactInfo />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.3}>
          <motion.div
            className="mt-20 bg-gray-800 rounded-lg border border-green-400/30 p-12"
            whileHover={{ scale: 1.01, borderColor: "rgba(74, 222, 128, 0.5)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-green-400 mb-4">Response Times</h2>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex gap-2">
                    <span className="text-green-400">✓</span> <span><strong>Email:</strong> 24 hours</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-400">✓</span> <span><strong>WhatsApp:</strong> 1-2 hours</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-400">✓</span> <span><strong>Emergency:</strong> 15 minutes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-400">✓</span> <span><strong>Phone:</strong> Same day</span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-400 mb-4">Business Hours</h2>
                <ul className="space-y-3 text-gray-300">
                  <li><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM WAT</li>
                  <li><strong>Saturday:</strong> 10:00 AM - 2:00 PM WAT</li>
                  <li><strong>Sunday:</strong> Closed (Emergency line available)</li>
                  <li><strong>Emergency:</strong> 24/7 available</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}
