/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,jsx,ts}'],
  theme: {
    fontFamily: {
      sans: ['"Roboto"'],
    },
    extend: {
      colors: {
        background: '#1c2128',
        foreground: '#FFFFFF',

        secondary: '#161b22',

        accent: '#22d3ee',
        danger: '#ff6b6b',

        bgSecondary: 'oklch(27.4% 0.006 286.033)',

        border: '#424242',
      },
      fontSize: {
        sm: '0.75rem',
        base: '0.91rem',
        md: '0.95rem',
        lg: '1rem',
        xl: '1.13rem',
      },
      screens: {
        sm: '690px',

        md: '898px',

        lg: '1024px',

        xl: '1300px',

        '2xl': '1536px',
      },
    },
  },

  plugins: [],
};
