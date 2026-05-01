import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        cream: "#f5f0e8",
        gold: "#c9a84c",
        blush: "#f2b8b8",
        rose: "#d4788a",
        "muted-rose": "#e8b4bc",
        "polaroid-white": "#fafaf5",
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        dancing: ["var(--font-dancing)", "cursive"],
        caveat: ["var(--font-caveat)", "cursive"],
        dm: ["var(--font-dm)", "sans-serif"],
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px 2px var(--glow-color)" },
          "50%": { boxShadow: "0 0 16px 6px var(--glow-color)" },
        },
        "shimmer-sweep": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200vw)" },
        },
        "float-up": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-20px)", opacity: "0.5" },
        },
        "gold-pulse": {
          "0%, 100%": { color: "#c9a84c", textShadow: "0 0 4px rgba(201,168,76,0.3)" },
          "50%": { color: "#e8d48a", textShadow: "0 0 12px rgba(201,168,76,0.6)" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "shimmer-sweep": "shimmer-sweep 2s ease-in-out forwards",
        "float-up": "float-up 1s ease-out forwards",
        "gold-pulse": "gold-pulse 1.5s ease-in-out 1",
        "text-shimmer": "text-shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
