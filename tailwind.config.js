/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#e5f3ff',
          100: '#cce6ff',
          200: '#99cdff',
          300: '#66b4ff',
          400: '#339bff',
          500: '#0B3B60', // Mandiri Blue
          600: '#082f4d',
          700: '#06233a',
          800: '#041826',
          900: '#020c13',
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '3840px'
      }
    },
  },
  darkMode: "class",
}
