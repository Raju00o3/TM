"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 800);
    const completeTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 600);
    }, 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* Polaroid SVG drawing itself */}
      <svg
        width="80"
        height="96"
        viewBox="0 0 80 96"
        fill="none"
        style={{ marginBottom: 24 }}
      >
        <rect
          x="2"
          y="2"
          width="76"
          height="92"
          rx="3"
          stroke="#f5f0e8"
          strokeWidth="1.5"
          strokeDasharray="336"
          strokeDashoffset="336"
          style={{
            animation: "draw-polaroid 1.5s ease forwards",
          }}
        />
        <rect
          x="10"
          y="10"
          width="60"
          height="60"
          rx="1"
          stroke="#f5f0e8"
          strokeWidth="1"
          strokeDasharray="240"
          strokeDashoffset="240"
          opacity="0.5"
          style={{
            animation: "draw-polaroid 1.5s ease 0.3s forwards",
          }}
        />
        <line
          x1="20"
          y1="82"
          x2="60"
          y2="82"
          stroke="#f5f0e8"
          strokeWidth="1"
          opacity="0.3"
          strokeDasharray="40"
          strokeDashoffset="40"
          style={{
            animation: "draw-polaroid 0.8s ease 0.8s forwards",
          }}
        />
      </svg>

      {/* Loading text */}
      <p
        className="font-caveat text-cream"
        style={{
          fontSize: 18,
          opacity: showText ? 0.7 : 0,
          transition: "opacity 0.5s ease",
          letterSpacing: 1,
        }}
      >
        loading your memories...
      </p>

      <style jsx>{`
        @keyframes draw-polaroid {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
