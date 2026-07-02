import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        bg: "#06080f",
        panel: "rgba(14,18,32,0.72)",
        neon: {
          cyan: "#00f5ff",
          purple: "#9d00ff",
          pink: "#ff2a8d"
        }
      },
      boxShadow: {
        glow: "0 0 24px rgba(0,245,255,0.25)",
        glowPurple: "0 0 24px rgba(157,0,255,0.25)"
      },
      backdropBlur: { xs: '2px' },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } }
      }
    },
  },
  plugins: [],
};
export default config;
