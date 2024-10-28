/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        basecl: {
          100: "#608BC1",
          200: "#133E87",
        },
      },
    },
  },
  plugins: [],
}

