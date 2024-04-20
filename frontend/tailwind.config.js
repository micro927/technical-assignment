/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        openSans: ['"Open Sans"'],
      },
      colors: {
        dark: '#111114',
      },
      fontSize: {
        xxs: '10px',
      },
    },
  },
  plugins: [],
};
