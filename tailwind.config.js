/** @type {import('tailwindcss').Config} */
export const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#070B14",
          800: "#0F172A",
          700: "#111827",
          cyan: "#22D3EE",
          green: "#22C55E",
          indigo: "#6366F1",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
      },
      boxShadow: {
        glow: "0 28px 80px rgba(8, 15, 35, 0.22)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
