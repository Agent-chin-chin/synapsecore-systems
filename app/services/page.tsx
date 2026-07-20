'use client'
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";
import ServiceDetails from "@/components/service-details";

export default function Services() {
  return (
    <ScrollReveal>
      <motion.div
        className="min-h-[calc(100vh-64px)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <ServiceDetails />
      </motion.div>
    </ScrollReveal>
  );
}
