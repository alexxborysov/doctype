/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,jsx,ts}'],
  theme: {
    fontFamily: {
      sans: ['"Roboto"'],
    },
    extend: {
      colors: {
        primary: '#74C0FC',
        secondary: 'rgba(64, 71, 86, 1)',
        accent: '#1871C2',
        danger: '#ff6b6b',
        fontPrimary: '#FFFFFF',
        fontSecondary: '#828282',
        bgPrimary: '#1F1F1F',
        bgSecondary: '#2e2e2e',
        borderDark: '#424242',
        borderLight: '#424242',
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
