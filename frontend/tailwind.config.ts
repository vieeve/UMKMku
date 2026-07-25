import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          light: "#EDEBFD",
          hover: "#4338CA",
          dark: "#3730A3",
          alt: "#6C5CE7",
        },
        background: "#F8FAFC",
        surface: "#FFFFFF",
        success: {
          DEFAULT: "#22C55E",
          light: "#DCFCE7",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#FEE2E2",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        text: {
          primary: "#1E1B39",
          secondary: "#8A8AA3",
          muted: "#64748B",
        },
        border: "#EDEDF4",
      },
      borderRadius: {
        DEFAULT: "16px",
        card: "16px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(30, 27, 57, 0.05)",
        card: "0 2px 12px -2px rgba(30, 27, 57, 0.04), 0 1px 4px -1px rgba(30, 27, 57, 0.02)",
        "card-hover": "0 10px 25px -5px rgba(79, 70, 229, 0.08), 0 8px 10px -6px rgba(79, 70, 229, 0.04)",
      },
      fontFamily: {
        sans: ["var(--font-quicksand)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
