/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E13",
        brand: { 
          fg: "#F5F5F7", 
          purple: "#6E56FF", 
          mint: "#24E6B7"
        }
      },
      boxShadow: { 
        hover: "0 10px 24px rgba(124,92,255,.25)" 
      }
    },
  },
  plugins: [],
}
