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
        primary: {
          DEFAULT: '#DC2626', // Red for primary actions
          hover: '#B91C1C',
          light: '#FEE2E2',
        },
        secondary: {
          DEFAULT: '#EC4899', // Pink for buttons like "Update Profile"
          hover: '#DB2777',
        },
        sidebar: {
          DEFAULT: '#F5F5DC', // Light beige for sidebar background
          active: '#DC2626', // Red for active menu item
        },
        accent: {
          blue: '#3B82F6', // Blue for verification checkmark
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

