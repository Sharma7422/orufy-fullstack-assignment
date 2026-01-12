/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B1C6D",
        accent: "#FF7A00",
      },
    },
  },
  plugins: [],
};
