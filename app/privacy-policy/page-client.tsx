'use client'
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" delay={0}>
          <motion.h1
            className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Privacy Policy
          </motion.h1>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.1}>
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"
            whileHover={{ boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Introduction
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              SynapseCore Systems ("we", "our", or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website, use our services, or otherwise communicate
              with us.
            </motion.p>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Information We Collect
            </motion.h2>
            <motion.ul
              className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <li>Personal information you provide directly (name, email, phone, etc.)</li>
              <li>Usage data collected automatically when you use our services</li>
              <li>Technical information from your device and browser</li>
              <li>Information from cookies and similar tracking technologies</li>
            </motion.ul>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              How We Use Your Information
            </motion.h2>
            <motion.ul
              className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <li>To provide and maintain our services</li>
              <li>To process your service requests and bookings</li>
              <li>To communicate with you about your account and services</li>
              <li>To improve our services and user experience</li>
              <li>For security, fraud prevention, and legal compliance</li>
            </motion.ul>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Data Sharing and Disclosure
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              We do not sell your personal information to third parties. We may share your
              information with:
            </motion.p>
            <motion.ul
              className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <li>Trusted service providers who help us operate our business</li>
              <li>Payment processors for handling transactions</li>
              <li>Legal authorities when required by law or to protect our rights</li>
              <li>Business partners in connection with a merger or acquisition</li>
            </motion.ul>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Your Rights and Choices
            </motion.h2>
            <motion.ul
              className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <li>Right to access, correct, or delete your personal information</li>
              <li>Right to object to or restrict processing of your data</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent where applicable</li>
            </motion.ul>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Data Security
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              We implement appropriate technical and organizational measures to protect your
              personal information against accidental or unlawful destruction, loss, alteration,
              unauthorized disclosure or access.
            </motion.p>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Changes to This Privacy Policy
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              We may update this Privacy Policy from time to time. The updated version will be
              effective immediately upon posting unless otherwise specified.
            </motion.p>

            <motion.p
              className="text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Last updated: April 26, 2026<br/>
              Contact: privacy@synapsecoresystems.com
            </motion.p>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}
