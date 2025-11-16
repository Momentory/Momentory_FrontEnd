import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import {
  extractRegionName,
  getStampImagePath,
  getCulturalStampImagePath,
} from '../../utils/stampUtils';
import PointIcon from '../../assets/icons/pointIcon.svg?react';

export default function StampAcquisitionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAnimation, setShowAnimation] = useState(false);

  const stampType = location.state?.stampType ?? null;
  // stampName (문화 스탬프)와 regionName (지역 스탬프) 우선순위 처리
  const rawStampName =
    location.state?.stampName || location.state?.regionName || '하남시';
  const culturalStampName = location.state?.stampName; // 문화 스탬프 원본 이름
  const regionName = extractRegionName(rawStampName); // 지역명 추출 (표시용)
  const points = location.state?.points || 50;

  // 스탬프 타입에 따라 이미지 경로 결정
  const stampImagePath =
    location.state?.stampImagePath ||
    (stampType === 'cultural'
      ? getCulturalStampImagePath(culturalStampName || regionName) // 문화 스탬프는 원본 이름 사용
      : getStampImagePath(regionName));

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!stampType) {
      navigate('/photo-upload-complete', {
        replace: true,
        state: location.state,
      });
      return;
    }
    setShowAnimation(true);
  }, [stampType, navigate, location.state]);

  const handleClick = () => {
    const photoId = location.state?.photoId as number | undefined;
    const nearbySpots = location.state?.nearbySpots;

    console.log('[StampAcquisition] handleClick - photoId:', photoId);
    console.log(
      '[StampAcquisition] handleClick - location.state:',
      location.state
    );

    if (stampType === 'cultural') {
      // 문화 스탬프는 추천 여행지 페이지로 이동
      navigate('/recommended-places', {
        state: {
          ...location.state,
          photoId, // 명시적으로 photoId 포함
          nearbySpots, // nearbySpots도 명시적으로 포함
        },
      });
    } else {
      // 지역 스탬프는 피그마 디자인대로 photo-upload-complete로 이동
      navigate('/photo-upload-complete', {
        state: {
          ...location.state,
          photoId, // 명시적으로 photoId 포함
          nearbySpots, // nearbySpots도 명시적으로 포함
          regionName,
          points,
        },
      });
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!stampType) {
    return null;
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-white px-6 cursor-pointer"
      onClick={stampType === 'regional' ? handleClick : undefined}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center justify-center">
          <div
            className={`relative mb-8 transition-all duration-500 cursor-default ${
              showAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}
            onClick={handleContentClick}
          >
            <div className="w-[190px] h-[190px] bg-white rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden border border-[#D4D4D4] cursor-default">
              {!imageError ? (
                <img
                  src={stampImagePath}
                  alt={`${regionName} 스탬프`}
                  className="w-5/6 h-5/6 object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex items-center justify-center gap-1">
                  <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                  <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#FF7070] rounded-full flex items-center justify-center z-10">
                <Check className="w-7 h-7 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          <div
            className="text-center cursor-default mb-[150px]"
            onClick={handleContentClick}
          >
            <p className="text-[30px] font-bold text-[#C52222] mb-2 cursor-default">
              {stampType === 'cultural'
                ? location.state?.stampName || regionName
                : regionName}
            </p>
            <p className="text-[23px] font-bold text-[#000000] mb-2 cursor-default">
              {stampType === 'cultural'
                ? '문화 스탬프 획득'
                : '지역 스탬프 획득'}
            </p>
            <div className="flex items-center justify-center gap-2 cursor-default">
              <PointIcon className="w-6 h-6" />
              <span className="text-xl font-bold text-[#636363]">
                + {points}
              </span>
            </div>
          </div>
        </div>

        {stampType === 'cultural' && (
          <div className="space-y-3">
            <button
              onClick={handleClick}
              className="w-full py-4 px-6 rounded-[25px] bg-[#FF7070] text-white font-semibold text-lg hover:bg-[#ff6060] transition-colors cursor-pointer"
            >
              완료
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
