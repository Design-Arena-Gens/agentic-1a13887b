import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f5ff",
          100: "#dce7ff",
          200: "#b6cdff",
          300: "#8faeff",
          400: "#648aff",
          500: "#3a64ff",
          600: "#264add",
          700: "#1a36aa",
          800: "#122676",
          900: "#0b1949",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui"],
        display: ["'Urbanist'", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
