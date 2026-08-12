/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F5F2", surface: "#FFFDF9", "surface-sunken": "#EFE9E2",
        border: "#E3DDD5", "border-strong": "#CFC3B7",
        ink: { 900: "#252321", 600: "#6B625B", 400: "#9D938A" },
        person: "#C86647", team: "#9D4A70", project: "#6956B8",
        task: "#AE731B", technology: "#347866", document: "#4972B8",
      },
      fontFamily: {
        sans: ["Manrope", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SF Mono", "monospace"],
      },
      borderRadius: { DEFAULT: "12px", control: "10px", pill: "999px" },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: { shimmer: "shimmer 1.2s linear infinite", "fade-up": "fade-up 200ms cubic-bezier(0.16,1,0.3,1) both" },
      transitionDuration: { 80: "80ms", 120: "120ms", 350: "350ms" },
    },
  },
  plugins: [],
};
