import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "vector-magenta": "#eb088a",
        "vector-cobalt": "#313cff",
        "vector-teal": "#00d9c0",
      },
    },
  },
  plugins: [],
};
export default config;
