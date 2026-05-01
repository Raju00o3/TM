"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { polaroidData } from "@/lib/polaroidData";
import { getRandomPosition, getRandomRotation, getRandomSpring, shuffleArray } from "@/lib/utils";
import Polaroid from "./Polaroid";
import SpecialPolaroid from "./SpecialPolaroid";
import CounterDisplay from "./CounterDisplay";
import CanvasBackground from "./CanvasBackground";

interface PolaroidExplosionProps {
  onAllOpened: () => void;
}

interface PositionData {
  x: number;
  y: number;
  rotation: number;
  spring: { stiffness: number; damping: number; mass: number };
}

export default function PolaroidExplosion({ onAllOpened }: PolaroidExplosionProps) {
  const [openedIds, setOpenedIds] = useState<Set<number>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(true);
  const [allOpenedTriggered, setAllOpenedTriggered] = useState(false);
  const zIndexCounter = useRef(10);

  // Generate randomized positions once
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [shuffledData] = useState(() => shuffleArray(polaroidData));

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const newPositions = shuffledData.map(() => ({
      x: getRandomPosition(w, h).x,
      y: getRandomPosition(w, h).y,
      rotation: getRandomRotation(),
      spring: getRandomSpring(),
    }));
    setPositions(newPositions);
  }, [shuffledData]);

  // Hide hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = useCallback(
    (id: number) => {
      setOpenedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    },
    []
  );

  // Check if all opened
  useEffect(() => {
    if (openedIds.size >= 29 && !allOpenedTriggered) {
      setAllOpenedTriggered(true);
      setTimeout(() => onAllOpened(), 2000);
    }
  }, [openedIds, allOpenedTriggered, onAllOpened]);

  const handleInteract = useCallback(() => {
    zIndexCounter.current += 1;
    return zIndexCounter.current;
  }, []);

  const handleDismiss = useCallback((id: number) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const count = openedIds.size;

  if (positions.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Premium animated background */}
      <CanvasBackground openedCount={count} />

      {/* Counter */}
      <CounterDisplay count={count} total={29} />

      {/* Hint text */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.6, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.5 } }}
            transition={{ duration: 0.8 }}
            className="font-caveat"
            style={{
              position: "fixed",
              bottom: 30,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 18,
              color: "#f5f0e8",
              zIndex: 60,
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            pick them up, Chaplii. all 29.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render all polaroids */}
      {shuffledData.map((item, index) => {
        const pos = positions[index];
        if (!pos) return null;

        // Skip dismissed polaroids entirely
        if (dismissedIds.has(item.id)) return null;

        if (item.isSpecial) {
          return (
            <SpecialPolaroid
              key={item.id}
              data={item}
              initialX={pos.x}
              initialY={pos.y}
              initialRotation={pos.rotation}
              springConfig={pos.spring}
              onOpen={handleOpen}
              onInteract={handleInteract}
              isOpened={openedIds.has(item.id)}
              onDismiss={handleDismiss}
            />
          );
        }

        return (
          <Polaroid
            key={item.id}
            data={item}
            initialX={pos.x}
            initialY={pos.y}
            initialRotation={pos.rotation}
            springConfig={pos.spring}
            onOpen={handleOpen}
            onInteract={handleInteract}
            isOpened={openedIds.has(item.id)}
            onDismiss={handleDismiss}
          />
        );
      })}
    </div>
  );
}
