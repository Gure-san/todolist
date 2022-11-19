/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans' : ['Roboto', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        primary: '#261C2C',
        secondary: {
          100 : '#53475A',
          150 : '#473d4f'
        },
        tertiary: {
          100 : '#FEF7FF',
          150 : '#dbdbdb'
        },
        extra: {
          100 : '#00C9B2',
          150 : '#C2FCF2'
        }
      }
    },
  },
  plugins: [],
}

