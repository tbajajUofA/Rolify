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
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace", "monospace"]
      },
      boxShadow: {
        "spotify-glow": "0 0 34px rgba(29, 185, 84, 0.44)",
        "cyan-glow": "0 0 34px rgba(0, 229, 255, 0.35)",
        "magenta-glow": "0 0 34px rgba(212, 83, 126, 0.34)"
      },
      animation: {
        pulseSwitch: "pulseSwitch 2.6s ease-in-out infinite",
        driftStars: "driftStars 26s linear infinite",
        slowSpin: "slowSpin 22s linear infinite",
        redGiant: "redGiant 4.8s ease-in-out infinite"
      },
      keyframes: {
        pulseSwitch: {
          "0%, 100%": { boxShadow: "0 0 26px rgba(29, 185, 84, 0.45)" },
          "50%": { boxShadow: "0 0 62px rgba(30, 215, 96, 0.74)" }
        },
        driftStars: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-90px, 120px, 0)" }
        },
        slowSpin: {
          to: { transform: "rotate(360deg)" }
        },
        redGiant: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.74" },
          "50%": { transform: "scale(1.15)", opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
