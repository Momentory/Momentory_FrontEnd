import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PhotoUploadProgressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 진행률 애니메이션
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // 100% 도달 후 약간의 딜레이를 두고 다음 화면으로
    const timer = setTimeout(() => {
      navigate('/photo-upload-success', {
        state: location.state,
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate, location.state]);

  // SVG 원형 진행 바
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="relative">
        <svg className="w-40 h-40 transform -rotate-90">
          {/* 배경 원 */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="12"
          />
          {/* 진행 원 */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#FF7070"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-300 ease-out"
          />
        </svg>
      </div>
      <div className="mt-6 text-center">
        <p className="text-3xl font-semibold text-gray-800 mb-2">{progress}%</p>
        <p className="text-lg text-gray-600">사진 업로드 중...</p>
      </div>
    </div>
  );
}

