/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        secondaryBrown: "#8A8475",
        brand: {
          dark: "#0a0a0a",
          card: "#141414",
          gold: "#f59e0b",
          border: "rgba(255, 255, 255, 0.08)"
        }
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};