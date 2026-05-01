/** Generate a random position within viewport bounds, with padding to keep polaroids inside */
export function getRandomPosition(
  viewportWidth: number,
  viewportHeight: number,
  polaroidWidth: number = 240,
  polaroidHeight: number = 280
): { x: number; y: number } {
  const padding = 20;
  const x = padding + Math.random() * (viewportWidth - polaroidWidth - padding * 2);
  const y = padding + Math.random() * (viewportHeight - polaroidHeight - padding * 2);
  return { x, y };
}

/** Generate a random rotation between -35 and +35 degrees */
export function getRandomRotation(): number {
  return (Math.random() - 0.5) * 70;
}

/** Generate random spring physics parameters for unique feel per polaroid */
export function getRandomSpring(): {
  stiffness: number;
  damping: number;
  mass: number;
} {
  return {
    stiffness: 80 + Math.random() * 100,
    damping: 8 + Math.random() * 7,
    mass: 0.8 + Math.random() * 0.7,
  };
}

/** Generate a random initial velocity for explosion effect */
export function getRandomVelocity(): { x: number; y: number } {
  const angle = Math.random() * Math.PI * 2;
  const speed = 500 + Math.random() * 800;
  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  };
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Shuffle an array (Fisher-Yates) */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Linear interpolation */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}
