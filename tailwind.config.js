/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          0: "#f6f5f1",
          50: "#e9e7df",
          100: "#bdbab1",
          200: "#8a877f",
          300: "#5b5953",
          400: "#36352f",
          500: "#1f1e1a",
          600: "#161512",
          700: "#0f0e0c",
          800: "#0a0a08",
          900: "#050504",
        },
        accent: {
          DEFAULT: "#c7a878",
          warm: "#d9b489",
          dim: "#5d4e3a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.06em",
        tighter: "-0.035em",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.77, 0, 0.18, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        glow: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(1.04)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        blink: "blink 2s ease-in-out infinite",
        glow: "glow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
