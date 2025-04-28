/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1. Colors: deep indigo primary + muted sage accent
      colors: {
        primary: {
          50:  '#f2f5fa',
          100: '#e1e8f2',
          200: '#bcc9e2',
          300: '#8ea8d0',
          400: '#5f86be',
          500: '#345fa9', // base
          600: '#2e5598',
          700: '#264b85',
          800: '#1e4070',
          900: '#182e53',
        },
        accent: {
          50:  '#f6f7f5',
          100: '#e7e9e5',
          200: '#cfd3ca',
          300: '#b5b8ab',
          400: '#9ba78b',
          500: '#7d9d9c', // sage green
          600: '#738b8a',
          700: '#647877',
          800: '#556664',
          900: '#3b4f4d',
        },
        // you can still keep your old secondary / accent-bright sets
      },

      // 2. Typography: serif for headings, humanist sans for body
      fontFamily: {
        // keep your Inter for everything else if you like
        sans: ['Source Sans Pro', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        heading: ['Merriweather', 'serif'],
      },

      // Optional: a softer background
      backgroundColor: {
        page: '#F8F5F0',
      },
    },
  },

  // 3. Add the official typography plugin for beautiful prose defaults
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
