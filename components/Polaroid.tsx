"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PolaroidItem } from "@/lib/polaroidData";
import { playPickup, playThud } from "@/lib/sounds";

interface PolaroidProps {
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

function useTypewriter(text: string, speed: number = 15, active: boolean = false) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!active) {
      setDisplayedText("");
      setIsComplete(false);
      return;
    }

    let index = 0;
    setDisplayedText("");
    setIsComplete(false);

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, active]);

  return { displayedText, isComplete };
}

export default function Polaroid({
  data,
  initialX,
  initialY,
  initialRotation,
  springConfig,
  onOpen,
  onInteract,
  isOpened,
  onDismiss,
}: PolaroidProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [zIndex, setZIndex] = useState(10);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoMuted, setVideoMuted] = useState(true);

  const { displayedText, isComplete: typewriterComplete } = useTypewriter(
    data.compliment,
    15,
    isExpanded
  );

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

  const handleClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Prevent opening if this was a drag
      const endX = "clientX" in e ? e.clientX : (e as React.TouchEvent).changedTouches?.[0]?.clientX || 0;
      const endY = "clientY" in e ? e.clientY : (e as React.TouchEvent).changedTouches?.[0]?.clientY || 0;

      if (isDragging) return;

      const dx = Math.abs(endX - dragStartPos.current.x);
      const dy = Math.abs(endY - dragStartPos.current.y);
      if (dx > 5 || dy > 5) return;

      if (data.isSpecial) {
        onOpen(data.id);
        return;
      }

      setIsExpanded(true);
      if (!isOpened) {
        onOpen(data.id);
      }
    },
    [isDragging, data.id, data.isSpecial, onOpen, isOpened]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setVideoMuted(true);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    // Trigger dismiss animation after closing
    setIsDismissing(true);
  }, []);

  const handleVideoClick = useCallback(() => {
    if (videoRef.current) {
      setVideoMuted(!videoMuted);
      videoRef.current.muted = !videoMuted;
    }
  }, [videoMuted]);

  const borderStyle = data.isFaceDown
    ? "2px solid #333"
    : `2px solid ${data.borderColor}`;

  return (
    <>
      {/* Draggable Polaroid */}
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
                opacity: 1,
                scale: isDragging ? 1.05 : 1,
                rotate: initialRotation,
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
          zIndex: isDragging ? 50 : zIndex,
          width: 240,
          height: 280,
          border: borderStyle,
          padding: 10,
          display: "flex",
          flexDirection: "column",
          userSelect: "none",
          pointerEvents: isDismissing ? "none" : "auto",
        }}
      >
        {/* Photo/Video area */}
        <div
          style={{
            width: 220,
            height: 220,
            background: data.isFaceDown
              ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)"
              : "#e0ddd5",
            position: "relative",
            overflow: "hidden",
            borderRadius: 1,
          }}
        >
          {data.isSpecial && data.specialType === "sorry" && !data.isFaceDown && (
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
              {/* Envelope texture */}
              <div
                style={{
                  position: "absolute",
                  inset: 10,
                  border: "1px solid rgba(139,119,80,0.3)",
                  borderRadius: 2,
                }}
              />
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="38"
                  height="28"
                  rx="2"
                  stroke="#8b7750"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path d="M1 1 L20 16 L39 1" stroke="#8b7750" strokeWidth="1" fill="none" />
              </svg>
            </div>
          )}

          {data.isSpecial && data.specialType === "magnificent" && !data.isFaceDown && (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #f2b8b8 0%, #e8b4bc 50%, #d4788a 100%)",
              }}
            />
          )}

          {data.isSpecial && data.specialType === "luck" && (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: data.isFaceDown
                  ? "repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 10px, #222 10px, #222 20px)"
                  : "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {data.isFaceDown && (
                <span
                  style={{
                    color: "#444",
                    fontSize: 12,
                    fontFamily: "var(--font-caveat)",
                    transform: "rotate(180deg)",
                  }}
                >
                  ?
                </span>
              )}
            </div>
          )}

          {!data.isSpecial && !data.isVideo && (
            <img
              src={data.src}
              alt={data.label}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              draggable={false}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' fill='%23e0ddd5'%3E%3Crect width='220' height='220'/%3E%3Ctext x='50%25' y='50%25' font-family='system-ui' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3EPhoto%3C/text%3E%3C/svg%3E";
              }}
            />
          )}

          {!data.isSpecial && data.isVideo && (
            <>
              <div className="film-strip-left" />
              <div className="film-strip-right" />
              <video
                src={data.src}
                muted
                loop
                playsInline
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  (e.target as HTMLVideoElement).poster =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' fill='%23e0ddd5'%3E%3Crect width='220' height='220'/%3E%3Ctext x='50%25' y='50%25' font-family='system-ui' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3EVideo%3C/text%3E%3C/svg%3E";
                }}
              />
            </>
          )}
        </div>

        {/* Label area */}
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
            letterSpacing: 0.5,
          }}
        >
          {data.isFaceDown ? "" : data.label}
        </div>
      </motion.div>

      {/* Expanded View (non-special only) */}
      <AnimatePresence>
        {isExpanded && !data.isSpecial && (
          <motion.div
            className="polaroid-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.9)",
              zIndex: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding: "4vh 5vw",
              overflow: "auto",
            }}
          >
            {/* Polaroid card — constrained height so compliment fits below */}
            <motion.div
              layoutId={`polaroid-${data.id}`}
              className="polaroid-card polaroid-shadow-hover"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(420px, 85vw)",
                maxHeight: "60vh",
                height: "auto",
                border: `2px solid ${data.borderColor}`,
                padding: 14,
                display: "flex",
                flexDirection: "column",
                zIndex: 101,
                position: "relative",
                flexShrink: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {/* Full-size photo/video */}
              <div
                style={{
                  width: "100%",
                  flex: 1,
                  minHeight: 0,
                  background: "#e0ddd5",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 2,
                }}
              >
                {data.isVideo ? (
                  <>
                    <div className="film-strip-left" />
                    <div className="film-strip-right" />
                    <video
                      ref={videoRef}
                      src={data.src}
                      muted={videoMuted}
                      loop
                      playsInline
                      autoPlay
                      onClick={handleVideoClick}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        cursor: "none",
                      }}
                    />
                    {videoMuted && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          background: "rgba(0,0,0,0.5)",
                          color: "#fff",
                          fontSize: 12,
                          padding: "4px 8px",
                          borderRadius: 4,
                          fontFamily: "var(--font-dm)",
                        }}
                      >
                        tap for sound
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src={data.src}
                    alt={data.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    draggable={false}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' fill='%23e0ddd5'%3E%3Crect width='500' height='500'/%3E%3Ctext x='50%25' y='50%25' font-family='system-ui' font-size='18' fill='%23999' text-anchor='middle' dy='.3em'%3EReplace with real photo%3C/text%3E%3C/svg%3E";
                    }}
                  />
                )}
              </div>

              {/* Label in expanded view */}
              <div
                className="font-caveat"
                style={{
                  padding: "10px 0 2px",
                  color: "#2a2a2a",
                  fontSize: 22,
                  fontWeight: 700,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {data.label}
              </div>
            </motion.div>

            {/* Compliment text — in flow below the card, never overlapping */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-caveat"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "min(500px, 85vw)",
                textAlign: "center",
                color: "#f5f0e8",
                fontSize: "clamp(16px, 2.2vw, 22px)",
                lineHeight: 1.7,
                fontWeight: 400,
                zIndex: 102,
                flexShrink: 0,
              }}
            >
              {displayedText}
              {!typewriterComplete && <span className="typewriter-cursor" />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
