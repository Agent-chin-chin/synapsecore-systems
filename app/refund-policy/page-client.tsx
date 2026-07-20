'use client'
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function RefundPolicy() {
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
            Refund Policy
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
              Our Guarantee
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              At SynapseCore Systems, we stand behind our work with a satisfaction guarantee.
              If we are unable to resolve your reported issue, you may be eligible for a refund
              according to the terms outlined below.
            </motion.p>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Eligibility for Refunds
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              You may be eligible for a refund if:
            </motion.p>
            <motion.ul
              className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <li>We are unable to resolve the reported issue after reasonable effort</li>
              <li>The service was not performed as described in our service agreement</li>
              <li>Technical limitations prevent completion of the requested service</li>
              <li>We miss agreed-upon deadlines without proper notification and justification</li>
            </motion.ul>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Non-Refundable Situations
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              Refunds will not be provided in the following circumstances:
            </motion.p>
            <motion.ul
              className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <li>The issue was successfully resolved according to service specifications</li>
              <li>Client provided insufficient or inaccurate information preventing service completion</li>
              <li>Client declined recommended solutions or failed to provide necessary access</li>
              <li>Issues arising from client's unauthorized modifications after service completion</li>
              <li>Force majeure events or circumstances beyond our reasonable control</li>
            </motion.ul>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Refund Process
            </motion.h2>
            <motion.ol
              className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <li>Contact our support team to discuss your concerns</li>
              <li>Our team will review the service case and documentation</li>
              <li>If eligible, we'll process the refund to your original payment method</li>
              <li>Refunds typically appear within 5-10 business days</li>
            </motion.ol>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Partial Refunds
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              In cases where partial service was completed, we may offer a proportional refund
              based on the work performed versus the total service agreed upon.
            </motion.p>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Subscription Services
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              For recurring subscription plans:
            </motion.p>
            <motion.ul
              className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <li>Cancellations are effective at the end of the current billing period</li>
              <li>No refunds for partial months unless service was not provided as promised</li>
              <li>Emergency Rescue Plan cancellations may be subject to different terms</li>
            </motion.ul>

            <motion.h2
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Changes to Refund Policy
            </motion.h2>
            <motion.p
              className="text-gray-600 dark:text-gray-300 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              We reserve the right to modify this Refund Policy at any time. Changes will be
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
              Contact: billing@synapsecoresystems.com
            </motion.p>
          </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}
