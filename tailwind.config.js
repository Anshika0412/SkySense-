/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // ✅ REQUIRED for manual dark mode toggling
  theme: {
    extend: {
      backgroundImage: {
        "day-bg": "url('daybg.jpeg')",
        "night-bg":
          "url('nightbg.jpeg')",
      },
    },
  },
  plugins: [],
}

