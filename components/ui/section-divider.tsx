'use client';

import { motion } from 'framer-motion';

export default function SectionDivider() {
  return (
    <div className="relative h-24 w-full overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-1/2 h-px w-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      </motion.div>

      {/* Floating particles along the line */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/60 blur-[1px]"
        animate={{
          x: [-60, 60, -60],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
