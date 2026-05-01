"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TRACKS = [
  "/audio/tere-liye.mp3",
  "/audio/banjara.mp3",
];

export default function AudioManager() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackIndexRef = useRef(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [trackName, setTrackName] = useState("");

  const loadTrack = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const trackPath = TRACKS[index];
    audio.src = trackPath;
    audio.load();

    // Extract display name
    const name = trackPath.split("/").pop()?.replace(".mp3", "").replace(/-/g, " ") || "";
    setTrackName(name);
  }, []);

  const playNextTrack = useCallback(() => {
    trackIndexRef.current = (trackIndexRef.current + 1) % TRACKS.length;
    loadTrack(trackIndexRef.current);
    audioRef.current?.play().catch(() => {});
  }, [loadTrack]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Start with a random track
    const startIndex = Math.floor(Math.random() * TRACKS.length);
    trackIndexRef.current = startIndex;

    const audio = new Audio(TRACKS[startIndex]);
    audio.loop = false; // We handle track switching ourselves
    audio.volume = 0.18;
    audio.preload = "auto";
    audioRef.current = audio;

    const name = TRACKS[startIndex].split("/").pop()?.replace(".mp3", "").replace(/-/g, " ") || "";
    setTrackName(name);
    setIsReady(true);

    // When current track ends, play the next one
    audio.addEventListener("ended", () => {
      trackIndexRef.current = (trackIndexRef.current + 1) % TRACKS.length;
      loadTrack(trackIndexRef.current);
      audio.play().catch(() => {});
    });

    // Keep trying on every interaction until audio actually plays
    let started = false;
    const tryPlay = () => {
      if (started) return;

      audio.volume = 0;
      audio.play().then(() => {
        // Success! Stop listening and fade in
        started = true;
        setHasInteracted(true);
        window.removeEventListener("click", tryPlay);
        window.removeEventListener("touchstart", tryPlay);
        window.removeEventListener("keydown", tryPlay);

        // Smooth fade-in over 2 seconds
        let vol = 0;
        const fadeIn = setInterval(() => {
          vol += 0.01;
          if (vol >= 0.18) {
            vol = 0.18;
            clearInterval(fadeIn);
          }
          audio.volume = vol;
        }, 50);
      }).catch(() => {
        // Failed — browser blocked it. Will try again on next interaction.
      });
    };

    window.addEventListener("click", tryPlay);
    window.addEventListener("touchstart", tryPlay);
    window.addEventListener("keydown", tryPlay);

    return () => {
      window.removeEventListener("click", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("keydown", tryPlay);
      audio.pause();
      audio.src = "";
    };
  }, [loadTrack]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const skipTrack = () => {
    playNextTrack();
  };

  if (!isReady) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* Mute/Unmute button */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute music" : "Mute music"}
        style={{
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
        {isMuted ? "🔇" : "♫"}
      </button>

      {/* Skip track button */}
      <button
        onClick={skipTrack}
        aria-label="Next track"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "rgba(245,240,232,0.5)",
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
          cursor: "none",
        }}
      >
        ⏭
      </button>

      {/* Track name (subtle) */}
      {hasInteracted && trackName && (
        <span
          className="font-caveat"
          style={{
            fontSize: 12,
            color: "rgba(245,240,232,0.25)",
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
            maxWidth: 120,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {trackName}
        </span>
      )}
    </div>
  );
}
