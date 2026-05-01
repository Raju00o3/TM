"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { playSoftClick } from "@/lib/sounds";

export default function FinaleSequence() {
  const [phase, setPhase] = useState<
    "shimmer" | "text" | "ticket" | "seal-cracked" | "buttons" | "celebration" | "final"
  >("shimmer");

  const [sealCracked, setSealCracked] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  const runButtonRef = useRef<HTMLButtonElement>(null);
  const runButtonPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);
  const runButtonInitialized = useRef(false);

  // Phase progression
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Shimmer phase
    timers.push(setTimeout(() => setPhase("text"), 1500));
    // Text phase
    timers.push(setTimeout(() => setPhase("ticket"), 3500));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Running button logic
  useEffect(() => {
    if (!showButtons) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (!runButtonRef.current) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (!runButtonInitialized.current) {
        const rect = runButtonRef.current.getBoundingClientRect();
        runButtonPos.current = { x: rect.left, y: rect.top };
        runButtonInitialized.current = true;
      }

      const btn = runButtonRef.current;
      const btnRect = btn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const dx = mousePos.current.x - btnCenterX;
      const dy = mousePos.current.y - btnCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (150 - distance) / 150;
        const moveX = -dx * force * 2.5;
        const moveY = -dy * force * 2.5;

        runButtonPos.current.x += moveX;
        runButtonPos.current.y += moveY;

        // Clamp within viewport
        const maxX = window.innerWidth - btnRect.width - 20;
        const maxY = window.innerHeight - btnRect.height - 20;
        runButtonPos.current.x = Math.max(20, Math.min(runButtonPos.current.x, maxX));
        runButtonPos.current.y = Math.max(20, Math.min(runButtonPos.current.y, maxY));

        btn.style.position = "fixed";
        btn.style.left = `${runButtonPos.current.x}px`;
        btn.style.top = `${runButtonPos.current.y}px`;
        btn.style.transform = "none";
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [showButtons]);

  const handleSealClick = useCallback(() => {
    playSoftClick();
    setSealCracked(true);
    setTimeout(() => {
      setShowButtons(true);
    }, 800);
  }, []);

  const handleYesClick = useCallback(async () => {
    playSoftClick();
    setCelebrating(true);

    // Dynamic import of canvas-confetti
    const confetti = (await import("canvas-confetti")).default;

    const colors = ["#c9a84c", "#f2b8b8", "#ffffff", "#d4788a", "#faeeda"];

    // Three bursts
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors,
          shapes: ["circle"],
          ticks: 200,
          gravity: 0.8,
          scalar: 1.2,
        });
      }, i * 300);
    }

    setTimeout(() => setShowFinal(true), 2500);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Gold shimmer line */}
      {phase === "shimmer" && (
        <div
          style={{
            position: "absolute",
            bottom: "40%",
            left: 0,
            right: 0,
            height: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "30%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent 0%, #c9a84c 50%, transparent 100%)",
              animation: "shimmer-sweep 2s ease-in-out forwards",
            }}
          />
        </div>
      )}

      {/* "there's one more thing, baby..." */}
      <AnimatePresence>
        {(phase === "text") && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="font-dancing"
            style={{
              fontSize: "clamp(24px, 4vw, 40px)",
              color: "#f5f0e8",
              textAlign: "center",
            }}
          >
            there&apos;s one more thing, baby...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket */}
      <AnimatePresence>
        {(phase === "ticket" || phase === "seal-cracked" || phase === "buttons") && !showFinal && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{
              opacity: celebrating ? 0.3 : 1,
              y: 0,
              scale: celebrating ? 0.9 : 1,
            }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="ticket-grain"
            style={{
              width: "min(480px, 90vw)",
              background: "linear-gradient(145deg, #f5ecd7 0%, #e8dfc8 50%, #d4ccb5 100%)",
              borderRadius: 8,
              padding: "32px 28px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {/* Perforated edge */}
            <div className="perforated-edge" style={{ position: "absolute", left: 20, top: 0, height: "100%" }} />

            {/* ADMIT ONE header */}
            <div
              style={{
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              <span
                className="gold-foil-text font-cormorant"
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: 6,
                }}
              >
                ✦ ADMIT ONE ✦
              </span>
            </div>

            {/* Ticket content */}
            <div
              className="font-cormorant"
              style={{
                color: "#3d3425",
                fontSize: "clamp(14px, 1.8vw, 17px)",
                lineHeight: 2.2,
                paddingLeft: 30,
              }}
            >
              <div>
                <strong>For:</strong> Misri{" "}
                <span style={{ opacity: 0.6, fontSize: "0.85em" }}>
                  (aka panda, aka jaadi, aka Chaplii, aka dramebaaz)
                </span>
              </div>
              <div>
                <strong>From:</strong> Tirth{" "}
                <span style={{ opacity: 0.6, fontSize: "0.85em" }}>
                  (aka pegu, aka chaman, aka the guy who built all this)
                </span>
              </div>
              <div>
                <strong>Event:</strong> OUR FIRST DATE
              </div>
              <div>
                <strong>Date:</strong>{" "}
                <span className="gold-foil-text" style={{ fontWeight: 600 }}>
                  May 2, 2026
                </span>
              </div>
              <div>
                <strong>Dress code:</strong>{" "}
                <span style={{ color: "#d4788a", fontWeight: 500 }}>red, if you're feeling it.</span>
                <br />
                <span style={{ opacity: 0.6, fontSize: "0.85em", fontStyle: "italic" }}>
                  but honestly? you make everything look magnificent, misu.
                </span>
              </div>
            </div>

            {/* Wax seal */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 24,
                marginBottom: 16,
              }}
            >
              {!sealCracked ? (
                <button
                  onClick={handleSealClick}
                  className="wax-seal"
                  aria-label="Open seal"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z"
                      fill="#e8c8c8"
                      opacity="0.8"
                    />
                  </svg>
                </button>
              ) : (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 0], rotate: [0, 15, -15] }}
                  transition={{ duration: 0.6 }}
                  className="wax-seal"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, #c43e3e, #8b2020)",
                    clipPath: "polygon(0 0, 50% 10%, 100% 0, 90% 50%, 100% 100%, 50% 90%, 0 100%, 10% 50%)",
                  }}
                />
              )}
            </div>

            {/* Bottom text */}
            <div
              className="font-dancing"
              style={{
                textAlign: "center",
                color: "#5a4a3a",
                fontSize: "clamp(16px, 2vw, 22px)",
                marginTop: 8,
              }}
            >
              so... will you come, babyy? ❤️
            </div>

            {/* Celebration punch-hole overlay */}
            {celebrating && (
              <motion.div
                initial={{ clipPath: "circle(0% at 50% 50%)" }}
                animate={{ clipPath: "circle(80% at 50% 50%)" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)",
                  zIndex: 5,
                  borderRadius: 8,
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      {showButtons && !celebrating && !showFinal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            display: "flex",
            gap: 24,
            marginTop: 32,
            alignItems: "center",
            zIndex: 510,
          }}
        >
          {/* YES button */}
          <motion.button
            onClick={handleYesClick}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(201,168,76,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="font-dancing"
            style={{
              background: "transparent",
              border: "2px solid #c9a84c",
              color: "#c9a84c",
              padding: "14px 36px",
              fontSize: 22,
              borderRadius: 50,
              cursor: "none",
              letterSpacing: 1,
              transition: "all 0.3s ease",
            }}
          >
            yes, obviously 🥰
          </motion.button>

          {/* Running button */}
          <button
            ref={runButtonRef}
            className="font-dm"
            style={{
              background: "transparent",
              border: "1px solid rgba(245,240,232,0.2)",
              color: "rgba(245,240,232,0.4)",
              padding: "8px 16px",
              fontSize: 13,
              borderRadius: 20,
              cursor: "none",
              whiteSpace: "nowrap",
              transition: "none",
              zIndex: 510,
            }}
          >
            let me think...
          </button>
        </motion.div>
      )}

      {/* Final message */}
      <AnimatePresence>
        {showFinal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="font-cormorant"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 600,
              color: "#f5f0e8",
              textAlign: "center",
              lineHeight: 1.8,
              padding: "0 20px",
            }}
          >
            May 2. our first date.
            <br />
            <span className="font-dancing" style={{ fontSize: "0.75em", fontWeight: 700 }}>
              can&apos;t wait, misu. ❤️
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
