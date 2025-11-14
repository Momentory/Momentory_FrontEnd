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
  corePlugins: {
    // html2canvas와 호환을 위해 oklab/oklch 사용 비활성화
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    textOpacity: false,
  },
  // 대체: 투명도가 있는 색상을 rgba로 직접 사용
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
