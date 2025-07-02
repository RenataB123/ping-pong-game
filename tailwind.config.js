/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'shake': 'shake 0.5s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff' },
          'to': { boxShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff' },
        }
      }
    },
  },
  plugins: [],
}