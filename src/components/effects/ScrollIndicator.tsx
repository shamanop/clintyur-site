"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.5, duration: 0.8 }}
    >
      <span
        className="text-text-muted text-xs uppercase tracking-[0.3em]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Scroll
      </span>
      <motion.div
        className="w-px h-8 bg-gradient-to-b from-amber to-transparent"
        animate={{ scaleY: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top" }}
      />
    </motion.div>
  );
}
