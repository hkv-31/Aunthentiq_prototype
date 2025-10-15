module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4d4fbfff", // main brand color
          dark: "#3730a3",
        },
        accent: {
          DEFAULT: "#ce0bbeff", // secondary brand color
          dark: "#7f2f6dff",
        },
      },
    },
  },
  plugins: [],
};
