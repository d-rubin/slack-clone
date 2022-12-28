/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      gridTemplateRows: {
        8: "repeat(8, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
        14: "repeat(14, minmax(0, 1fr))",
      },
      gridRowEnd: {
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
      },
      gridRowStart: {
        8: "8",
        9: "9",
        10: "10",
        11: "11",
        12: "12",
        13: "13",
      },
    },
    screens: {
      sm: "360px",
      // => @media (min-width: 360spx) { ... }

      md: "480px",
      // => @media (min-width: 480px) { ... }

      lg: "768px",
      // => @media (min-width: 768px) { ... }

      xl: "1024px",
      // => @media (min-width: 1024px) { ... }

      "2xl": "1200px",
      // => @media (min-width: 1200px) { ... }
    },
  },

  plugins: [],
};
