"use client";

import { motion } from "motion/react";

interface CounterDisplayProps {
  count: number;
  total: number;
}

export default function CounterDisplay({ count, total }: CounterDisplayProps) {
  const isComplete = count >= total;

  return (
    <motion.div
      className="font-caveat"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      style={{
        position: "fixed",
        top: 24,
        right: 28,
        fontSize: 20,
        fontWeight: 700,
        zIndex: 60,
        color: isComplete ? "#c9a84c" : "#f5f0e8",
        letterSpacing: 2,
        pointerEvents: "none",
        textShadow: isComplete ? "0 0 12px rgba(201,168,76,0.6)" : "none",
      }}
    >
      <motion.span
        key={count}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        {count}
      </motion.span>
      {" / "}
      {total}
      {isComplete && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ duration: 1.5 }}
          style={{ marginLeft: 8 }}
        >
          ✦
        </motion.span>
      )}
    </motion.div>
  );
}
