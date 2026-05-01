"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { soloPhotoSources } from "@/lib/polaroidData";

interface MagnificentMontageProps {
  onClose: () => void;
}

export default function MagnificentMontage({ onClose }: MagnificentMontageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const allSlides = soloPhotoSources;

  const advanceSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= allSlides.length - 1) {
        setShowFinal(true);
        return prev;
      }
      return prev + 1;
    });
  }, [allSlides.length]);

  useEffect(() => {
    timerRef.current = setInterval(advanceSlide, 3000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advanceSlide]);

  useEffect(() => {
    if (showFinal) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => setIsComplete(true), 5000);
    }
  }, [showFinal]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      onClick={isComplete ? onClose : undefined}
    >
      {!showFinal && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Photo */}
            <img
              src={allSlides[currentIndex].src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.6)",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            {/* Overlay text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-cormorant"
              style={{
                position: "absolute",
                fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: 600,
                color: "#ffffff",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                letterSpacing: 4,
                textTransform: "lowercase",
                textAlign: "center",
                padding: "0 20px",
              }}
            >
              {allSlides[currentIndex].overlayText}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Final slide */}
      {showFinal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            textAlign: "center",
            padding: "0 30px",
          }}
        >
          <span
            className="font-cormorant"
            style={{
              fontSize: "clamp(20px, 3vw, 32px)",
              color: "#f5f0e8",
              lineHeight: 2,
              fontWeight: 400,
              maxWidth: 500,
            }}
          >
            every single one, panda.
            <br />
            every outfit. every version of you.
            <br />
            <br />
            <span style={{ fontWeight: 600, fontSize: "clamp(24px, 3.5vw, 38px)" }}>
              magnificent. always.
            </span>
          </span>
        </motion.div>
      )}

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

      {/* Progress dots */}
      {!showFinal && (
        <div
          style={{
            position: "fixed",
            bottom: 30,
            display: "flex",
            gap: 6,
          }}
        >
          {allSlides.map((_, i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i === currentIndex ? "#f5f0e8" : "rgba(245,240,232,0.3)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
