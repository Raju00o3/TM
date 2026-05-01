"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";

interface LadyLuckRevealProps {
  onClose: () => void;
}

const LUCK_LINES = [
  "I didn't even have a job when i met you.",
  "within a week of you walking into my life — i had two.",
  "people call it coincidence.",
  "but i don't believe in luck anymore.",
  "i just believe in you, my lady luck. 🌹🫶",
];

export default function LadyLuckReveal({ onClose }: LadyLuckRevealProps) {
  const [cloverDrawn, setCloverDrawn] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Animate clover drawing
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path");
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setCloverDrawn(true);
      },
    });

    paths.forEach((path, i) => {
      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: "power2.inOut",
        },
        i * 0.3
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!cloverDrawn) return;

    let line = 0;
    const interval = setInterval(() => {
      line++;
      if (line <= LUCK_LINES.length) {
        setVisibleLines(line);
      } else {
        clearInterval(interval);
        setTimeout(() => setIsComplete(true), 2000);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [cloverDrawn]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.95)",
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
      onClick={isComplete ? onClose : undefined}
    >
      {/* Four-leaf clover SVG */}
      <svg
        ref={svgRef}
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        style={{ overflow: "visible" }}
      >
        {/* Top leaf */}
        <path
          d="M60 60 C60 40, 45 20, 60 10 C75 20, 60 40, 60 60"
          stroke="#c9a84c"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right leaf */}
        <path
          d="M60 60 C80 60, 100 45, 110 60 C100 75, 80 60, 60 60"
          stroke="#c9a84c"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bottom leaf */}
        <path
          d="M60 60 C60 80, 75 100, 60 110 C45 100, 60 80, 60 60"
          stroke="#c9a84c"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left leaf */}
        <path
          d="M60 60 C40 60, 20 75, 10 60 C20 45, 40 60, 60 60"
          stroke="#c9a84c"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Stem */}
        <path
          d="M60 60 L60 90 Q58 100, 52 105"
          stroke="#c9a84c"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Text lines */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        {LUCK_LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: i < visibleLines ? 1 : 0,
              y: i < visibleLines ? 0 : 10,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-cormorant"
            style={{
              fontSize: "clamp(18px, 2.5vw, 26px)",
              color: i === LUCK_LINES.length - 1 ? "#c9a84c" : "#f5f0e8",
              fontWeight: i === LUCK_LINES.length - 1 ? 600 : 400,
              textAlign: "center",
              letterSpacing: 0.5,
              lineHeight: 1.5,
              padding: "0 20px",
            }}
          >
            {line}
          </motion.div>
        ))}
      </div>

      {/* Close hint */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1 }}
          className="font-caveat"
          style={{
            position: "fixed",
            bottom: 30,
            fontSize: 14,
            color: "#f5f0e8",
          }}
        >
          tap anywhere to close
        </motion.div>
      )}
    </motion.div>
  );
}
