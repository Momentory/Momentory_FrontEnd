import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { extractRegionName, getStampImagePath } from '../../utils/stampUtils';
import PointIcon from '../../assets/icons/pointIcon.svg?react';

export default function StampAcquisitionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAnimation, setShowAnimation] = useState(false);

  const stampType = location.state?.stampType || 'regional';
  const rawRegionName = location.state?.regionName || '하남시';
  const regionName = extractRegionName(rawRegionName);
  const points = location.state?.points || 50;
  const stampImagePath =
    location.state?.stampImagePath || getStampImagePath(regionName);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const handleClick = () => {
    if (stampType === 'cultural') {
      navigate('/recommended-places');
    } else {
      navigate('/photo-upload-complete', {
        state: {
          ...location.state,
          regionName,
          points,
        },
      });
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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
            className="text-center cursor-default mb-30"
            onClick={handleContentClick}
          >
            <p className="text-2xl font-semibold text-[#FF7070] mb-3 cursor-default">
              {stampType === 'cultural'
                ? location.state?.stampName || regionName
                : regionName}
            </p>
            <p className="text-lg font-bold text-[#000000] mb-4 cursor-default">
              {stampType === 'cultural'
                ? '문화 스탬프 획득'
                : '지역 스탬프 획득'}
            </p>
            <div className="flex items-center justify-center gap-2 cursor-default">
              <PointIcon className="w-6 h-6" />
              <span className="text-xl font-bold text-gray-800">
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
