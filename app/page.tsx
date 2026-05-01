"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import SecretGate from "@/components/SecretGate";
import LoadingScreen from "@/components/LoadingScreen";
import OpeningSequence from "@/components/OpeningSequence";
import PolaroidExplosion from "@/components/PolaroidExplosion";
import FinaleSequence from "@/components/FinaleSequence";

type AppPhase = "gate" | "loading" | "opening" | "explosion" | "finale";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("gate");

  const handleGateUnlocked = useCallback(() => {
    setPhase("loading");
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setPhase("opening");
  }, []);

  const handleOpeningComplete = useCallback(() => {
    setPhase("explosion");
  }, []);

  const handleAllOpened = useCallback(() => {
    setPhase("finale");
  }, []);

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0a0a0a",
        position: "relative",
      }}
    >
      <AnimatePresence mode="wait">
        {phase === "gate" && (
          <SecretGate key="gate" onUnlocked={handleGateUnlocked} />
        )}

        {phase === "loading" && (
          <LoadingScreen
            key="loading"
            onComplete={handleLoadingComplete}
          />
        )}
      </AnimatePresence>

      {phase === "opening" && (
        <OpeningSequence
          key="opening"
          onComplete={handleOpeningComplete}
        />
      )}

      {phase === "explosion" && (
        <PolaroidExplosion
          key="explosion"
          onAllOpened={handleAllOpened}
        />
      )}

      {phase === "finale" && (
        <FinaleSequence key="finale" />
      )}
    </main>
  );
}
