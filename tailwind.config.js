const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['"Nunito"', ...defaultTheme.fontFamily.sans]
      },
      backgroundColor: {
        'google': '#4285F4', // Color de fondo de Google
      }
    }
  },
  plugins: [],
}

