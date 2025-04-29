/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F2D4B',
          50: '#f2f5fa',
          100: '#e1e8f2',
          200: '#bcc9e2',
          300: '#8ea8d0',
          400: '#5f86be',
          500: '#345fa9',
          600: '#2e5598',
          700: '#264b85',
          800: '#1e4070',
          900: '#182e53',
        },
        accent: {
          DEFAULT: '#7D9D9C',
          50: '#f6f7f5',
          100: '#e7e9e5',
          200: '#cfd3ca',
          300: '#b5b8ab',
          400: '#9ba78b',
          500: '#7d9d9c',
          600: '#738b8a',
          700: '#647877',
          800: '#556664',
          900: '#3b4f4d',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['var(--font-inter)', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;