"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PolaroidItem } from "@/lib/polaroidData";
import { playPickup, playThud } from "@/lib/sounds";
import SorryLetter from "./SorryLetter";
import MagnificentMontage from "./MagnificentMontage";
import LadyLuckReveal from "./LadyLuckReveal";

interface SpecialPolaroidProps {
  data: PolaroidItem;
  initialX: number;
  initialY: number;
  initialRotation: number;
  springConfig: { stiffness: number; damping: number; mass: number };
  onOpen: (id: number) => void;
  onInteract: () => number;
  isOpened: boolean;
  onDismiss: (id: number) => void;
}

export default function SpecialPolaroid({
  data,
  initialX,
  initialY,
  initialRotation,
  springConfig,
  onOpen,
  onInteract,
  isOpened,
  onDismiss,
}: SpecialPolaroidProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [zIndex, setZIndex] = useState(10);
  const [isFlipped, setIsFlipped] = useState(data.isFaceDown);
  const [sorryComplete, setSorryComplete] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    playPickup();
    const newZ = onInteract();
    setZIndex(newZ);
  }, [onInteract]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    playThud();
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;
      const dx = Math.abs(e.clientX - dragStartPos.current.x);
      const dy = Math.abs(e.clientY - dragStartPos.current.y);
      if (dx > 5 || dy > 5) return;

      // Lady Luck: flip first if face-down
      if (data.specialType === "luck" && isFlipped) {
        setIsFlipped(false);
        return;
      }

      setIsExpanded(true);
      if (!isOpened) {
        onOpen(data.id);
      }
    },
    [isDragging, data.id, data.specialType, isFlipped, onOpen, isOpened]
  );

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    // Trigger dismiss animation after closing
    setIsDismissing(true);
  }, []);

  const getFaceContent = () => {
    if (data.specialType === "sorry") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(145deg, #d4c5a0 0%, #c9b88a 30%, #b8a97a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 10,
              border: "1px solid rgba(139,119,80,0.3)",
              borderRadius: 2,
            }}
          />
          <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
            <rect x="1" y="1" width="38" height="28" rx="2" stroke="#8b7750" strokeWidth="1.5" fill="none" />
            <path d="M1 1 L20 16 L39 1" stroke="#8b7750" strokeWidth="1" fill="none" />
          </svg>
        </div>
      );
    }

    if (data.specialType === "magnificent") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f2b8b8 0%, #e8b4bc 50%, #d4788a 100%)",
          }}
        />
      );
    }

    if (data.specialType === "luck") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: isFlipped
              ? "repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 10px, #222 10px, #222 20px)"
              : "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isFlipped && (
            <span
              style={{
                color: "#444",
                fontSize: 14,
                fontFamily: "var(--font-caveat)",
                transform: "rotate(180deg)",
                display: "inline-block",
              }}
            >
              ?
            </span>
          )}
          {!isFlipped && (
            <span style={{ color: "#555", fontSize: 24 }}>🍀</span>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Draggable Special Polaroid */}
      <motion.div
        layoutId={`polaroid-${data.id}`}
        className={`polaroid-card ${isDragging ? "polaroid-shadow-hover" : "polaroid-shadow"} ${data.glowClass}`}
        drag={!isDismissing}
        dragMomentum={true}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        initial={{
          x: typeof window !== "undefined" ? window.innerWidth / 2 - 120 : 0,
          y: typeof window !== "undefined" ? window.innerHeight / 2 - 140 : 0,
          opacity: 0,
          scale: 0,
          rotate: 0,
        }}
        animate={
          isDismissing
            ? {
                x: initialX,
                y: initialY - 120,
                opacity: 0,
                scale: 0.3,
                rotate: initialRotation + 20,
                filter: "blur(6px)",
              }
            : {
                x: initialX,
                y: initialY,
                opacity: sorryComplete && data.specialType === "sorry" ? 1 : 1,
                scale: isDragging ? 1.05 : 1,
                rotate: isFlipped ? 180 + initialRotation : initialRotation,
                filter: "blur(0px)",
              }
        }
        transition={
          isDismissing
            ? {
                duration: 0.7,
                ease: [0.4, 0, 0.2, 1],
              }
            : {
                type: "spring",
                stiffness: springConfig.stiffness,
                damping: springConfig.damping,
                mass: springConfig.mass,
                opacity: { duration: 0.3 },
              }
        }
        onAnimationComplete={() => {
          if (isDismissing) {
            onDismiss(data.id);
          }
        }}
        whileHover={isDismissing ? {} : { scale: 1.03 }}
        style={{
          zIndex: isDragging ? 50 : sorryComplete ? 45 : zIndex,
          width: 240,
          height: 280,
          border: `2px solid ${data.borderColor}`,
          padding: 10,
          display: "flex",
          flexDirection: "column",
          userSelect: "none",
          pointerEvents: isDismissing ? "none" : "auto",
        }}
      >
        {/* Face content */}
        <div
          style={{
            width: 220,
            height: 220,
            position: "relative",
            overflow: "hidden",
            borderRadius: 1,
          }}
        >
          {getFaceContent()}
        </div>

        {/* Label */}
        <div
          className="font-caveat"
          style={{
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2a2a2a",
            fontSize: 17,
            fontWeight: 700,
          }}
        >
          {isFlipped ? "" : data.label}
        </div>

        {/* Warm glow for completed sorry */}
        {sorryComplete && data.specialType === "sorry" && (
          <div
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: 4,
              boxShadow: "0 0 20px 5px rgba(201,168,76,0.2)",
              pointerEvents: "none",
            }}
          />
        )}
      </motion.div>

      {/* Expanded Special Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="polaroid-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleClose}
            style={{ zIndex: 200 }}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", height: "100%" }}>
              {data.specialType === "sorry" && (
                <SorryLetter
                  onComplete={() => setSorryComplete(true)}
                  onClose={handleClose}
                />
              )}
              {data.specialType === "magnificent" && (
                <MagnificentMontage onClose={handleClose} />
              )}
              {data.specialType === "luck" && (
                <LadyLuckReveal onClose={handleClose} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
