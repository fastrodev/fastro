import { type Config } from "npm:tailwindcss@3.4.15";

/**
 * see: https://tailwindcss.com/docs/content-configuration
 */
export default {
  content: [
    "./components/**/*.tsx",
    "./modules/**/**/*.tsx",
    "./middleware/**/**/*.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Headings
        serif: ["Merriweather", "serif"], // Body text
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "cursor-blink": "blink 1s step-end infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      colors: {
        primary: {
          "50": "#eff6ff",
          "100": "#dbeafe",
          "200": "#bfdbfe",
          "300": "#93c5fd",
          "400": "#60a5fa",
          "500": "#3b82f6",
          "600": "#2563eb",
          "700": "#1d4ed8",
          "800": "#1e40af",
          "900": "#1e3a8a",
          "950": "#172554",
        },
      },
    },
  },
} satisfies Config;
