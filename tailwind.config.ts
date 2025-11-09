import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        nanum: ['NanumSquareRound', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
