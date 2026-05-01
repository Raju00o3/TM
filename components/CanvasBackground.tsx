"use client";

import { useEffect, useRef } from "react";

interface BokehOrb {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacitySpeed: number;
  opacityDir: number;
  maxOpacity: number;
  minOpacity: number;
  color: [number, number, number]; // RGB
}

interface TinyLight {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinklePhase: number;
  brightness: number;
  color: [number, number, number];
}

interface CanvasBackgroundProps {
  openedCount?: number;
}

// Warm, romantic color palette for the bokeh orbs
const BOKEH_COLORS: [number, number, number][] = [
  [201, 168, 76],   // gold
  [218, 185, 107],  // light gold
  [242, 184, 184],  // blush pink
  [212, 120, 138],  // rose
  [232, 180, 188],  // muted rose
  [245, 230, 210],  // warm cream
  [180, 140, 80],   // deep amber
  [255, 200, 150],  // peach
];

const TINY_LIGHT_COLORS: [number, number, number][] = [
  [255, 240, 200],  // warm white
  [201, 168, 76],   // gold
  [242, 200, 200],  // soft pink
  [255, 220, 180],  // peach glow
];

export default function CanvasBackground({ openedCount = 0 }: CanvasBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bokehRef = useRef<BokehOrb[]>([]);
  const tinyLightsRef = useRef<TinyLight[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create bokeh orbs — large, soft, dreamy circles
    const orbCount = 18 + Math.min(openedCount, 15);
    while (bokehRef.current.length < orbCount) {
      bokehRef.current.push(createBokehOrb(canvas.width, canvas.height));
    }

    // Create tiny fairy lights — small twinkling dots
    if (tinyLightsRef.current.length === 0) {
      for (let i = 0; i < 80; i++) {
        tinyLightsRef.current.push(createTinyLight(canvas.width, canvas.height));
      }
    }

    const animate = () => {
      if (!canvas || !ctx) return;
      timeRef.current += 0.016; // ~60fps time step

      const w = canvas.width;
      const h = canvas.height;

      // === Base: Deep warm gradient ===
      const baseGrad = ctx.createRadialGradient(
        w * 0.5, h * 0.5, 0,
        w * 0.5, h * 0.5, w * 0.85
      );
      baseGrad.addColorStop(0, "#1a1218");   // warm dark center (brown-purple)
      baseGrad.addColorStop(0.4, "#140e14"); // deep plum
      baseGrad.addColorStop(0.7, "#0f0b10"); // near black with warmth
      baseGrad.addColorStop(1, "#0a0808");   // warm black edges
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w, h);

      // === Ambient warm wash (slowly moving) ===
      const t = timeRef.current;
      const washX = w * (0.3 + 0.4 * Math.sin(t * 0.15));
      const washY = h * (0.4 + 0.2 * Math.cos(t * 0.12));
      const wash = ctx.createRadialGradient(washX, washY, 0, washX, washY, w * 0.6);
      wash.addColorStop(0, "rgba(120, 80, 40, 0.06)");
      wash.addColorStop(0.5, "rgba(80, 40, 50, 0.03)");
      wash.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);

      // === Bokeh orbs — the fairy lights ===
      for (const orb of bokehRef.current) {
        // Move slowly
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        // Breathing opacity
        orb.opacity += orb.opacityDir * orb.opacitySpeed;
        if (orb.opacity >= orb.maxOpacity) {
          orb.opacity = orb.maxOpacity;
          orb.opacityDir = -1;
        }
        if (orb.opacity <= orb.minOpacity) {
          orb.opacity = orb.minOpacity;
          orb.opacityDir = 1;
        }

        // Wrap around edges with buffer
        const buf = orb.radius * 2;
        if (orb.x < -buf) orb.x = w + buf;
        if (orb.x > w + buf) orb.x = -buf;
        if (orb.y < -buf) orb.y = h + buf;
        if (orb.y > h + buf) orb.y = -buf;

        const [r, g, b] = orb.color;

        // Outer soft glow (the "bokeh" effect)
        const outerGrad = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        outerGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${orb.opacity * 0.5})`);
        outerGrad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${orb.opacity * 0.25})`);
        outerGrad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${orb.opacity * 0.08})`);
        outerGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = outerGrad;
        ctx.fill();

        // Inner bright core (the "light source")
        const coreGrad = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius * 0.15
        );
        coreGrad.addColorStop(0, `rgba(255, 255, 240, ${orb.opacity * 0.8})`);
        coreGrad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${orb.opacity * 0.4})`);
        coreGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      }

      // === Tiny twinkling fairy lights ===
      for (const light of tinyLightsRef.current) {
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * light.twinkleSpeed + light.twinklePhase));
        const alpha = light.brightness * twinkle;

        const [r, g, b] = light.color;

        // Tiny dot
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        // Tiny halo
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.12})`;
        ctx.fill();
      }

      // === Cinematic vignette ===
      const vigGrad = ctx.createRadialGradient(
        w / 2, h / 2, w * 0.3,
        w / 2, h / 2, w * 0.75
      );
      vigGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      vigGrad.addColorStop(0.6, "rgba(0, 0, 0, 0.15)");
      vigGrad.addColorStop(1, "rgba(0, 0, 0, 0.5)");
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [openedCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

function createBokehOrb(w: number, h: number): BokehOrb {
  const maxOpacity = 0.12 + Math.random() * 0.22; // 0.12 — 0.34
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    radius: 40 + Math.random() * 120,  // Large, soft circles
    speedX: (Math.random() - 0.5) * 0.15,
    speedY: (Math.random() - 0.5) * 0.12,
    opacity: Math.random() * maxOpacity,
    opacitySpeed: 0.001 + Math.random() * 0.002,
    opacityDir: Math.random() > 0.5 ? 1 : -1,
    maxOpacity,
    minOpacity: maxOpacity * 0.2,
    color: BOKEH_COLORS[Math.floor(Math.random() * BOKEH_COLORS.length)],
  };
}

function createTinyLight(w: number, h: number): TinyLight {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: 0.8 + Math.random() * 1.5,
    twinkleSpeed: 0.5 + Math.random() * 2,
    twinklePhase: Math.random() * Math.PI * 2,
    brightness: 0.3 + Math.random() * 0.5,
    color: TINY_LIGHT_COLORS[Math.floor(Math.random() * TINY_LIGHT_COLORS.length)],
  };
}
