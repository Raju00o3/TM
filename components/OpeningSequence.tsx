"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { playChime } from "@/lib/sounds";

interface OpeningSequenceProps {
  onComplete: () => void;
}

export default function OpeningSequence({ onComplete }: OpeningSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const fourContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const monthsTextRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"name" | "message" | "four" | "shatter" | "done">("name");

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("done");
        setTimeout(onComplete, 200);
      },
    });

    // Phase 1: "Misri." letter by letter
    if (nameRef.current) {
      const text = "Misri.";
      nameRef.current.innerHTML = "";
      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.opacity = "0";
        span.style.display = "inline-block";
        nameRef.current!.appendChild(span);
      });

      const chars = nameRef.current.querySelectorAll("span");
      tl.to(chars, {
        opacity: 1,
        duration: 0.1,
        stagger: 0.08,
        ease: "power2.out",
      });

      // Pause on name
      tl.to({}, { duration: 1 });

      // Fade out name
      tl.to(nameRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }

    // Phase 2: "babyy, I made you something."
    tl.call(() => setPhase("message"));
    if (messageRef.current) {
      tl.fromTo(
        messageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power2.inOut" }
      );
      tl.to({}, { duration: 0.8 });
      tl.to(messageRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }

    // Phase 3: "4" SVG stroke draw + text
    tl.call(() => setPhase("four"));
    tl.call(() => {
      if (svgRef.current) {
        const path = svgRef.current.querySelector("path");
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.inOut",
          });
        }
      }
    });

    // Months text materializes
    if (monthsTextRef.current) {
      tl.fromTo(
        monthsTextRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );
    }

    // Play chime
    tl.call(() => playChime());
    tl.to({}, { duration: 1.2 });

    // Phase 4: Shatter everything into particles
    tl.call(() => setPhase("shatter"));
    tl.call(() => {
      if (!fourContainerRef.current) return;
      const elements = fourContainerRef.current.querySelectorAll("*");
      const particles: HTMLDivElement[] = [];

      // Create particle burst
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.width = `${3 + Math.random() * 6}px`;
        particle.style.height = `${3 + Math.random() * 6}px`;
        particle.style.background = i % 3 === 0 ? "#c9a84c" : "#f5f0e8";
        particle.style.borderRadius = "50%";
        particle.style.left = "50%";
        particle.style.top = "50%";
        particle.style.pointerEvents = "none";
        fourContainerRef.current!.appendChild(particle);
        particles.push(particle);
      }

      // Shatter original elements
      gsap.to(elements, {
        opacity: 0,
        scale: 0,
        duration: 0.4,
        ease: "power2.in",
      });

      // Explode particles
      particles.forEach((particle) => {
        gsap.to(particle, {
          x: (Math.random() - 0.5) * window.innerWidth * 1.5,
          y: (Math.random() - 0.5) * window.innerHeight * 1.5,
          opacity: 0,
          scale: 0,
          rotation: Math.random() * 720 - 360,
          duration: 1.2 + Math.random() * 0.5,
          ease: "power2.out",
        });
      });
    });

    tl.to({}, { duration: 1.5 });

    // Fade out entire container
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Phase 1: Name */}
      <div
        ref={nameRef}
        className="font-cormorant"
        style={{
          position: "absolute",
          fontSize: "clamp(48px, 8vw, 96px)",
          fontWeight: 600,
          color: "#f5f0e8",
          letterSpacing: 4,
          display: phase === "name" ? "block" : "none",
        }}
      />

      {/* Phase 2: Message */}
      <div
        ref={messageRef}
        className="font-dancing"
        style={{
          position: "absolute",
          fontSize: "clamp(24px, 4vw, 42px)",
          color: "#f5f0e8",
          opacity: 0,
          display: phase === "message" || phase === "name" ? "block" : "none",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        babyy, I made you something.
      </div>

      {/* Phase 3 & 4: "4" and text */}
      <div
        ref={fourContainerRef}
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: phase === "four" || phase === "shatter" ? 1 : 0,
        }}
      >
        <svg
          ref={svgRef}
          width="120"
          height="140"
          viewBox="0 0 120 140"
          fill="none"
          style={{ overflow: "visible" }}
        >
          <path
            d="M85 10 L85 100 M85 70 L20 70 L75 10"
            stroke="#c9a84c"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <div
          ref={monthsTextRef}
          className="font-cormorant"
          style={{
            fontSize: "clamp(20px, 3vw, 32px)",
            color: "#f5f0e8",
            opacity: 0,
            letterSpacing: 3,
            textAlign: "center",
          }}
        >
          months of you, panda.
        </div>
      </div>
    </div>
  );
}
