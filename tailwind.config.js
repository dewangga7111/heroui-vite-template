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
          50: '#e6f0fa',
          100: '#ccdf2',
          200: '#99c2e6',
          300: '#66a3d9',
          400: '#3385cc',
          500: '#003d79', // Mandiri Blue
          600: '#003161',
          700: '#002548',
          800: '#001830',
          900: '#000c18',
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
