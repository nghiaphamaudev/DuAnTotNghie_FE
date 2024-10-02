/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xsm: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      colors: {
        active: "#ff9f43",
        primary: '#feca57',
        danger: "#e84118",
        success: '#4cd137',
        warning: '#fbc531',
        'bg-1': '#ccc',
        'bg-2': '#F5F5F5',
        'text-1': "#4d5152",
        'text-2': "#beb9a6",
      },
      fontSize: {
        small: '10px',
        base: '12px',
        medium: '14px',
        large: '16px'
      },
    },
  },
  plugins: [],
}