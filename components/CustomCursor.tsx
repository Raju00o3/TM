"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const heartContainerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const lastHeartTime = useRef(0);

  const spawnHeart = useCallback((x: number, y: number) => {
    if (!heartContainerRef.current) return;
    const now = Date.now();
    if (now - lastHeartTime.current < 80) return;
    lastHeartTime.current = now;

    const heart = document.createElement("span");
    heart.className = "heart-particle";
    heart.textContent = "❤";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.color = `hsl(${340 + Math.random() * 30}, 70%, ${65 + Math.random() * 20}%)`;
    heart.style.fontSize = `${6 + Math.random() * 6}px`;
    heart.style.opacity = "1";
    heart.style.transition = "none";
    heartContainerRef.current.appendChild(heart);

    let opacity = 1;
    let posY = y;
    const drift = (Math.random() - 0.5) * 1.5;
    let posX = x;

    const fadeOut = () => {
      opacity -= 0.025;
      posY -= 0.8;
      posX += drift;
      if (opacity <= 0) {
        heart.remove();
        return;
      }
      heart.style.opacity = String(opacity);
      heart.style.left = `${posX}px`;
      heart.style.top = `${posY}px`;
      requestAnimationFrame(fadeOut);
    };
    requestAnimationFrame(fadeOut);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
      }
      spawnHeart(e.clientX, e.clientY);
    };

    const animate = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`;
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, [spawnHeart]);

  return (
    <>
      {/* Dot cursor */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#f2b8b8",
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          mixBlendMode: "difference",
        }}
      />
      {/* Ring cursor */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid #f2b8b8",
          opacity: 0.4,
          pointerEvents: "none",
          zIndex: 99998,
          willChange: "transform",
        }}
      />
      {/* Heart trail container */}
      <div
        ref={heartContainerRef}
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 99997,
          overflow: "hidden",
        }}
      />
    </>
  );
}
