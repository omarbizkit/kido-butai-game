/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-navy': '#1a1f2c',
        'game-gold': '#d4af37',
        'carrier-gray': '#4a5568',
      },
    },
  },
  plugins: [],
};
