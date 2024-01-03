import { type Config } from "tailwindcss";

/**
 * see: https://tailwindcss.com/docs/content-configuration
 */
export default {
  content: [
    "./app/**/*.tsx",
    "./middleware/**/*.tsx",
  ],
} satisfies Config;
