/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "instagram-blue": "#1877f2",
        "instagram-gray": "#8e8e8e",
        "instagram-border": "#dbdbdb",
        "instagram-bg": "#fafafa",
      },
      fontFamily: {
        instagram: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
