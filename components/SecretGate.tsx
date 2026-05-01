"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SecretGateProps {
  onUnlocked: () => void;
}

const SECRET_WORD = "Pegu";

export default function SecretGate({ onUnlocked }: SecretGateProps) {
  const [typed, setTyped] = useState("");
  const [shake, setShake] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; delay: number }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate ambient floating particles on mount
  useEffect(() => {
    const pts = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 6,
    }));
    setParticles(pts);
  }, []);

  // Show the hint after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 5000);
    return () => clearTimeout(t);
  }, []);

  // Auto-focus invisible input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value; // Keep original casing from input
      const normalizedInput = val.toLowerCase();
      const normalizedSecret = SECRET_WORD.toLowerCase();

      // Only allow characters that could lead to the secret word (case-insensitive check)
      if (normalizedInput.length <= normalizedSecret.length) {
        if (normalizedSecret.startsWith(normalizedInput)) {
          setTyped(val);
        } else {
          // Wrong character — shake feedback
          setShake(true);
          setTimeout(() => setShake(false), 500);
        }
      }

      // Check if complete (case-insensitive check)
      if (normalizedInput === normalizedSecret) {
        setUnlocked(true);
        setTimeout(onUnlocked, 2200);
      }
    },
    [onUnlocked]
  );

  // Keep focus on input when clicking anywhere
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)", transition: { duration: 1.2 } }}
      transition={{ duration: 0.8 }}
      onClick={handleContainerClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        zIndex: 10001,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "text",
      }}
    >
      {/* Ambient floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: `${p.y}vh`,
            opacity: 0,
          }}
          animate={{
            y: [`${p.y}vh`, `${p.y - 15 - Math.random() * 10}vh`],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background:
              p.id % 3 === 0
                ? "rgba(201, 168, 76, 0.6)"
                : "rgba(245, 240, 232, 0.4)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Subtle radial vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="gate-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
            transition={{ duration: 0.6 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Decorative lock icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c9a84c"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.6 }}
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <circle cx="12" cy="16" r="1" fill="#c9a84c" />
              </svg>
            </motion.div>

            {/* The question */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-cormorant"
              style={{
                fontSize: "clamp(20px, 3vw, 28px)",
                color: "#f5f0e8",
                textAlign: "center",
                lineHeight: 1.8,
                letterSpacing: 1,
                maxWidth: 420,
                padding: "0 20px",
              }}
            >
              this is just for you, misudi.
              <br />
              <span style={{ opacity: 0.6, fontSize: "clamp(16px, 2vw, 20px)" }}>
                type the word only you know.
              </span>
            </motion.p>

            {/* Character slots */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : { opacity: 1, y: 0 }}
              transition={shake ? { duration: 0.5 } : { duration: 0.8, delay: 0.7 }}
              style={{
                display: "flex",
                gap: "clamp(8px, 2vw, 16px)",
              }}
            >
              {SECRET_WORD.split("").map((char, i) => {
                const isTyped = i < typed.length;
                const isCurrent = i === typed.length;

                return (
                  <motion.div
                    key={i}
                    animate={
                      isTyped
                        ? { scale: [1, 1.15, 1], borderColor: "#c9a84c" }
                        : {}
                    }
                    transition={{ duration: 0.25 }}
                    style={{
                      width: "clamp(38px, 7vw, 52px)",
                      height: "clamp(48px, 9vw, 64px)",
                      borderRadius: 8,
                      border: `1.5px solid ${
                        isTyped
                          ? "#c9a84c"
                          : isCurrent
                          ? "rgba(245, 240, 232, 0.5)"
                          : "rgba(245, 240, 232, 0.15)"
                      }`,
                      background: isTyped
                        ? "rgba(201, 168, 76, 0.08)"
                        : "rgba(245, 240, 232, 0.03)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      transition: "border-color 0.3s, background 0.3s",
                    }}
                  >
                    {/* Typed character */}
                    <AnimatePresence>
                      {isTyped && (
                        <motion.span
                          initial={{ opacity: 0, y: 10, scale: 0.5 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className="font-cormorant"
                          style={{
                            fontSize: "clamp(22px, 4vw, 32px)",
                            fontWeight: 600,
                            color: "#c9a84c",
                            textTransform: "lowercase",
                          }}
                        >
                          {typed[i]}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Blinking cursor on current slot */}
                    {isCurrent && !isTyped && (
                      <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        style={{
                          width: 2,
                          height: "50%",
                          background: "rgba(245, 240, 232, 0.6)",
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Hint text */}
            <AnimatePresence>
              {showHint && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="font-caveat"
                  style={{
                    fontSize: 15,
                    color: "#f5f0e8",
                    textAlign: "center",
                    marginTop: -10,
                  }}
                >
                  hint: your favorite nickname... 💕
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Unlock success animation */
          <motion.div
            key="gate-unlocked"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Unlocked lock icon */}
            <motion.div
              initial={{ opacity: 0, rotate: -15 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6 }}
            >
              <svg
                width="52"
                height="52"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c9a84c"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                <circle cx="12" cy="16" r="1" fill="#c9a84c" />
              </svg>
            </motion.div>

            {/* Success word glow */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-cormorant gold-foil-text"
              style={{
                fontSize: "clamp(32px, 6vw, 56px)",
                fontWeight: 600,
                letterSpacing: 6,
              }}
            >
              Pegu
            </motion.p>

            {/* Welcome message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="font-caveat"
              style={{
                fontSize: "clamp(16px, 2.5vw, 22px)",
                color: "#f5f0e8",
                textAlign: "center",
              }}
            >
              welcome in, baby. ❤️
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden input — captures all keyboard input */}
      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        style={{
          position: "absolute",
          opacity: 0,
          width: 1,
          height: 1,
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
