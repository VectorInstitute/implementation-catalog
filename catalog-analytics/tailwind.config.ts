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
        // Vector Institute Brand Colors - Primary
        "vector-magenta": "#EB088A",
        "vector-black": "#000000",
        "vector-grey": "#E9E8E8",
        // Vector Institute Brand Colors - Secondary
        "vector-cobalt": "#313CFF",
        "vector-violet": "#8A25C9",
        "vector-turquoise": "#48C0D9",
        "vector-tangerine": "#FF9E00",
        "vector-lime": "#CFF933",
      },
      fontFamily: {
        sans: ["Open Sans", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      backgroundImage: {
        "vector-gradient":
          "linear-gradient(135deg, #EB088A 0%, #8A25C9 50%, #313CFF 100%)",
        "vector-gradient-horizontal":
          "linear-gradient(90deg, #EB088A 0%, #8A25C9 50%, #313CFF 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
