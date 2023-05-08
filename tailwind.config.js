/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {

    extend: {
      colors: {
        'white': '#fff',
          'red': '#F93D3D',
          'black' : '#000'
        },
        fontSize: {
          'big': '6.4rem',
          '14px': '1.4rem',
          'big-mobile':'3.2rem'
        },

    },
  },
  plugins: [],
}
