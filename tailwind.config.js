/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Включаем поддержку темной темы через класс 'dark'
  darkMode: 'class', 
  theme: {
    extend: {},
  },
  plugins: [],
}
