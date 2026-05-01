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
  const heartSvgRef = useRef<SVGSVGElement>(null);
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

    // Phase 1: Premium Sketch Heart + "hi misudi."
    const paths = heartSvgRef.current?.querySelectorAll("path");
    if (paths) {
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });
      // Sketch drawing effect
      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.inOut",
        stagger: 0.2, // Each line draws slightly after the previous
      }, 0);
      
      // Heartbeat pulse after drawing
      tl.to(heartSvgRef.current, {
        scale: 1.05,
        duration: 1.2,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
      }, 1.5);
    }

    if (nameRef.current) {
      const text = "Hi misudi.";
      nameRef.current.innerHTML = "";
      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
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
      }, 0.5); // start typing slightly after heart starts drawing

      // Pause to let them read inside the drawn heart
      tl.to({}, { duration: 2.5 });

      // Fade out name and heart
      tl.to([nameRef.current, heartSvgRef.current], {
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
      {/* Phase 1: Heart and Name */}
      <div
        style={{
          position: "absolute",
          display: phase === "name" ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "clamp(300px, 80vw, 600px)",
            height: "clamp(300px, 80vw, 600px)",
            background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 65%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        <svg
          ref={heartSvgRef}
          width="min(90vw, 500px)"
          height="min(90vw, 500px)"
          viewBox="0 0 400 400"
          style={{
            position: "absolute",
            zIndex: 1,
            filter: "drop-shadow(0 0 12px rgba(201,168,76,0.4))",
          }}
        >
          {/* Layer 1: Faint outer sketch */}
          <path
            d="M 200 125 C 150 45 30 75 30 165 C 30 255 200 365 200 365 C 200 365 370 255 370 165 C 370 75 250 45 200 125 Z"
            fill="none"
            stroke="#c9a84c"
            strokeWidth="1.5"
            opacity="0.3"
            strokeLinecap="round"
          />
          {/* Layer 2: Main crisp core line */}
          <path
            d="M 200 130 C 155 50 35 80 35 170 C 35 260 200 370 200 370 C 200 370 365 260 365 170 C 365 80 245 50 200 130 Z"
            fill="none"
            stroke="#f5f0e8"
            strokeWidth="2.5"
            opacity="0.9"
            strokeLinecap="round"
          />
          {/* Layer 3: Offset inner glow line */}
          <path
            d="M 200 135 C 160 55 40 85 40 175 C 40 265 200 375 200 375 C 200 375 360 265 360 175 C 360 85 240 55 200 135 Z"
            fill="none"
            stroke="#c9a84c"
            strokeWidth="1"
            opacity="0.5"
            strokeLinecap="round"
          />
        </svg>

        <div
          ref={nameRef}
          className="font-cormorant"
          style={{
            position: "absolute",
            zIndex: 2,
            top: "50%", /* Position perfectly in the widest part of the heart */
            transform: "translateY(-50%)",
            fontSize: "clamp(32px, 6vw, 64px)",
            fontWeight: 600,
            color: "#f5f0e8",
            letterSpacing: 4,
            textShadow: "0 0 15px rgba(201,168,76,0.6)",
          }}
        />
      </div>

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
        i still can't believe it's already been...
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
          months down.
          <br />
          <span className="font-dancing" style={{ fontSize: "1.2em", opacity: 0.8, letterSpacing: 1 }}>
            with a lifetime left to go.
          </span>
        </div>
      </div>
    </div>
  );
}
