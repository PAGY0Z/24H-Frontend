/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // adapte si tu utilises `pages/`
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        limelight: ['Limelight', 'cursive'],
        limelight: ['Faculty Glyphic', 'serif'],
      },
    },
  },
  plugins: [],
};