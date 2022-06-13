module.exports = {
  mode: "jit",
  purge: ["./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#191A1E",
          700: "#262836",
          500: "#2E2E34",
          500: "#363341",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
