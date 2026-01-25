/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#1D4ED8",
        "accent-teal": "#14B8A6",
        "light-background": "#F0F9FF",
        "dark-text": "#1F2937",
        "light-text": "#E5E7EB",
        "white-text": "#FFFFFF",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
}
