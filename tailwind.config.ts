import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        spotify: {
          black: "#000000",
          near: "#050505",
          green: "#1DB954",
          neon: "#1ED760"
        },
        omnitrix: {
          green: "#00FF00",
          "green-dim": "#00CC00",
          black: "#000000",
          face: "#0a0f0a",
          panel: "#111811",
          hourglass: "#FFD700"
        },
        galaxy: {
          deep: "#0a0e1a",
          cyan: "#00E5FF",
          purple: "#7F77DD",
          magenta: "#D4537E",
          gold: "#FAC775",
          red: "#E24B4A",
          orange: "#D85A30",
          ice: "#B5D4F4"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace", "monospace"],
        display: ["var(--font-orbitron)", "Orbitron", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        "spotify-glow": "0 0 34px rgba(29, 185, 84, 0.44)",
        "omnitrix-glow": "0 0 28px rgba(0, 255, 0, 0.5)",
        "cyan-glow": "0 0 34px rgba(0, 229, 255, 0.35)",
        "magenta-glow": "0 0 34px rgba(212, 83, 126, 0.34)"
      },
      animation: {
        pulseSwitch: "pulseSwitch 2.6s ease-in-out infinite",
        omnitrixPulse: "omnitrixPulse 2s ease-in-out infinite"
      },
      keyframes: {
        pulseSwitch: {
          "0%, 100%": { boxShadow: "0 0 26px rgba(29, 185, 84, 0.45)" },
          "50%": { boxShadow: "0 0 62px rgba(30, 215, 96, 0.74)" }
        },
        omnitrixPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 255, 0, 0.35)" },
          "50%": { boxShadow: "0 0 48px rgba(0, 255, 0, 0.65)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
