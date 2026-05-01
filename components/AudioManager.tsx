"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioManager() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio("/audio/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.15;
    audio.preload = "auto";
    audioRef.current = audio;
    setIsReady(true);

    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        audio.play().catch(() => {
          console.warn("Background music (ambient.mp3) not found. This is fine.");
        });
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      audio.pause();
      audio.src = "";
    };
  }, [hasInteracted]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  if (!isReady) return null;

  return (
    <button
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute music" : "Mute music"}
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 9000,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "50%",
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        color: isMuted ? "rgba(245,240,232,0.3)" : "#f5f0e8",
        backdropFilter: "blur(8px)",
        transition: "all 0.3s ease",
        cursor: "none",
      }}
    >
      {isMuted ? "♪" : "♫"}
    </button>
  );
}
